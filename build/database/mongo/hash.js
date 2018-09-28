'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!hashRepository) hashRepository = new HashRepository();

    return hashRepository;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _database = require('./../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hashRepository;

var HashRepository = function () {
    function HashRepository() {
        _classCallCheck(this, HashRepository);
    }

    _createClass(HashRepository, [{
        key: 'insert',
        value: function insert(data) {
            console.log(data);
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('hash').create(data, function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'findHash',
        value: function findHash(hash) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('hash').findOne({
                    'hash': hash,
                    'type': 2
                }).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'deleteByHash',
        value: function deleteByHash(hash) {
            return new _bluebird2.default(function (resolve) {
                (0, _database.model)('hash').deleteOne({
                    'hash': hash
                }, function (err) {
                    resolve();
                });
            });
        }
    }]);

    return HashRepository;
}();