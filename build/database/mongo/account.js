'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!accountRepository) accountRepository = new AccountRepository();

    return accountRepository;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _database = require('./../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var accountRepository;

var AccountRepository = function () {
    function AccountRepository() {
        _classCallCheck(this, AccountRepository);
    }

    _createClass(AccountRepository, [{
        key: 'insert',
        value: function insert(data) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('account').create(data, function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'update',
        value: function update(id, data) {
            var self = this;

            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('account').updateOne({
                    '_id': id
                }, data, function () {
                    self.findOneById(id).then(function (account) {
                        resolve(account);
                    });
                });
            });
        }
    }, {
        key: 'findOneById',
        value: function findOneById(id) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('account').findById(id).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'findAccountsByIdentity',
        value: function findAccountsByIdentity(id) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('account').find({
                    identity_id: id
                }).then(function (results) {
                    resolve(results);
                });
            });
        }
    }, {
        key: 'findByUsername',
        value: function findByUsername(loginWith, request) {
            var query = (0, _database.model)('account'),
                whereOr = [];

            _lodash2.default.forEach(loginWith, function (type, input) {
                if (request[input]) {
                    whereOr.push({ 'account': request[input] });
                }
            });

            return new _bluebird2.default(function (resolve) {
                query.find({
                    $or: whereOr
                }).exec(function (err, accounts) {
                    resolve(accounts);
                });
            });
        }
    }]);

    return AccountRepository;
}();