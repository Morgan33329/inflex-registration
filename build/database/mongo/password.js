'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!passwordRepository) passwordRepository = new PasswordRepository();

    return passwordRepository;
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _database = require('./../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var passwordRepository;

var PasswordRepository = function () {
    function PasswordRepository() {
        _classCallCheck(this, PasswordRepository);
    }

    _createClass(PasswordRepository, [{
        key: 'insert',
        value: function insert(data) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('password').create(data, function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'update',
        value: function update(id, data) {
            var self = this;

            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('password').updateOne({
                    '_id': id
                }, data, function () {
                    self.findOneById(id).then(function (password) {
                        resolve(password);
                    });
                });
            });
        }
    }, {
        key: 'findOneById',
        value: function findOneById(id) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('password').findById(id).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'findPassword',
        value: function findPassword(identity) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('password').findOne({
                    'identity_id': identity
                }).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }]);

    return PasswordRepository;
}();