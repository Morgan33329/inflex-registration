'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _database = require('./../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createAccount(acc, type, identity) {
    return (0, _database.repository)('account').insert({
        'identity_id': identity,
        'account': acc,
        'type': type
    }).then(function (account) {
        console.log('Account: ' + acc + ' uploaded');

        return account;
    });
}

function createIdentity(activated, enabled, blocked) {
    activated = !activated ? true : false;
    enabled = !enabled ? true : false;
    blocked = blocked ? true : false;

    return (0, _database.repository)('identity').insert({
        'activated': activated,
        'enabled': enabled,
        'blocked': blocked
    }).then(function (identity) {
        console.log('Identity uploaded');

        return identity;
    });
}

function createPassword(password, identity) {
    return new _bluebird2.default(function (resolve, reject) {
        var saltRounds = 10;

        _bcrypt2.default.hash(password, saltRounds, function (err, hash) {
            (0, _database.repository)('password').insert({
                'identity_id': identity,
                'password': hash
            }).then(function (password) {
                console.log('Password uploaded');

                resolve(password);
            });
        });
    });
}

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'createWithUsernameAndPassword',
        value: function createWithUsernameAndPassword(loginWith, request) {
            return createIdentity().then(function (identity) {
                var accountIds = [];

                _lodash2.default.forEach(loginWith, function (type, input) {
                    if (request[input]) {
                        createAccount(request[input], type, identity.id);

                        accountIds.push();
                    }
                });

                createPassword(request.password, identity.id);

                return identity;
            }).catch(function (err) {
                console.log(err);
            });
        }
    }]);

    return _class;
}();

exports.default = _class;