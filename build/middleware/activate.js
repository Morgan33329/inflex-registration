'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (options, middleware) {
    settings = _lodash2.default.merge(defaultSettings, options || {});

    var ret = middleware || [];

    ret.push(checkCode);

    return ret;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _database = require('./../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSettings = {
    'template': {
        'failed': 'activated-fail'
    }
};
var settings = defaultSettings;

function getCode(req) {
    return req.query['hash'] || req.body['hash'];
}

var checkCode = function checkCode(req, res, next) {
    var code = getCode(req);

    (0, _database.repository)('hash').findHash(code).then(function (hash) {
        if (!hash) {
            res.render(settings.template.failed);
        } else {
            (0, _database.repository)('identity').update(hash.identity_id, {
                activated: true
            });

            (0, _database.repository)('hash').deleteByHash(code);

            next();
        }
    }).catch(function (err) {
        console.log(err);
    });
};