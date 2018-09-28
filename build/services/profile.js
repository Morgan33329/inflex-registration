'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _inflexAuthentication = require('inflex-authentication');

var _database = require('./../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'user',
        value: function user(_user) {
            this.userObject = _user;

            return this;
        }
    }, {
        key: 'update',
        value: function update(data) {
            var myId = (0, _database.getId)(this.userObject.user),
                loginWith = (0, _inflexAuthentication.authConfig)('loginWith');

            (0, _database.repository)('account').findAccountsByIdentity(myId).then(function (accounts) {
                if (!accounts.length) {
                    console.log("No account found for update");

                    return;
                }

                var updateThis = {};

                _lodash2.default.forEach(loginWith, function (type, input) {
                    if (data[input]) updateThis[type] = data[input];
                });

                _lodash2.default.forEach(accounts, function (account) {
                    if (updateThis[account.type] && updateThis[account.type] != account.account) {
                        (0, _database.repository)('account').update((0, _database.getId)(account), {
                            account: updateThis[account.type]
                        }).then(function () {
                            console.log("Account updated " + account.account + " -> " + updateThis[account.type]);
                        });
                    }
                });
            }).catch(function (err) {
                console.log(err);
            });

            if (data.password) {
                (0, _database.repository)('password').findPassword(myId).then(function (pwd) {
                    var saltRounds = 10;

                    _bcrypt2.default.hash(data.password, saltRounds, function (err, hash) {
                        (0, _database.repository)('password').update((0, _database.getId)(pwd), {
                            password: hash
                        }).then(function (pwd) {
                            console.log("Password updated");
                        });
                    });
                }).catch(function (err) {
                    console.log(err);
                });;
            }
        }
    }]);

    return _class;
}();

exports.default = _class;