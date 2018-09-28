'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (type) {
    switch (type) {
        case 'account':
            return (0, _account2.default)();
        case 'identity':
            return (0, _identity2.default)();
        case 'password':
            return (0, _password2.default)();
        case 'hash':
            return (0, _hash2.default)();
        default:
            console.log('Invalid repository type: ' + type);
    }
};

var _password = require('./mongo/password');

var _password2 = _interopRequireDefault(_password);

var _identity = require('./mongo/identity');

var _identity2 = _interopRequireDefault(_identity);

var _account = require('./mongo/account');

var _account2 = _interopRequireDefault(_account);

var _hash = require('./mongo/hash');

var _hash2 = _interopRequireDefault(_hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }