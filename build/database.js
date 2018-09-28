'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getType = getType;
exports.getId = getId;
exports.repository = repository;
exports.model = model;

var _database = require('inflex-authentication/database');

var _database2 = _interopRequireDefault(_database);

var _mongo = require('./database/mongo');

var _mongo2 = _interopRequireDefault(_mongo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getType(type) {
    return _database2.default.getType();
}

function getId(type) {
    return _database2.default.getId(type);
}

function repository(type) {
    switch (getType()) {
        case 'mongo':
            return (0, _mongo2.default)(type);
            break;
    }
}

function model(model) {
    return _database2.default.model(model);
}