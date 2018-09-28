'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!identityRepository) identityRepository = new IdentityRepository();

    return identityRepository;
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _database = require('./../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var identityRepository;

var IdentityRepository = function () {
    function IdentityRepository() {
        _classCallCheck(this, IdentityRepository);
    }

    _createClass(IdentityRepository, [{
        key: 'insert',
        value: function insert(data) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('identity').create(data, function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'update',
        value: function update(id, data) {
            var self = this;

            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('identity').updateOne({
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
                (0, _database.model)('identity').findById(id).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }]);

    return IdentityRepository;
}();