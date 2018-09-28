'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (options, middleware) {
    settings = _lodash2.default.merge(defaultSettings, options || {});

    var ret = validateUsername(middleware || []);

    ret.push(validatePassword, isValidRequest, checkExistsUsername, addProfileService);

    return ret;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _check = require('express-validator/check');

var _inflexAuthentication = require('inflex-authentication');

var _database = require('../database');

var _profile = require('../services/profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSettings = {
    'invalidRequest': function invalidRequest(req, res, errors) {
        return res.status(422).json({
            'error': true,
            'code': '4220303',
            'type': '',
            'title': 'Invalid registration request',
            'detail': 'Invalid registration request: ' + JSON.stringify(errors)
        });
    },

    'existsUsername': function existsUsername(req, res, types) {
        return res.status(422).json({
            'error': true,
            'code': '4220304',
            'type': '',
            'title': 'Someone registered with this data',
            'detail': 'This register data exists in database'
        });
    }
};
var settings = defaultSettings;

var validateUsername = function validateUsername(inputValidators) {
    var validateInputs = (0, _inflexAuthentication.authConfig)('validateInputs');

    _lodash2.default.forEach((0, _inflexAuthentication.authConfig)('loginWith'), function (type, input) {
        if (validateInputs[input]) inputValidators.push(function (req, res, next) {
            if (req.body[input]) validateInputs[input]((0, _check.check)(input))(req, res, next);else next();
        });
    });

    return inputValidators;
};

var validatePassword = function validatePassword(req, res, next) {
    var validateInputs = (0, _inflexAuthentication.authConfig)('validateInputs');

    if (req.body.password) {
        validateInputs.password((0, _check.check)('password'))(req, res, next);
    } else next();
};

var isValidRequest = function isValidRequest(req, res, next) {
    var errors = (0, _check.validationResult)(req);

    if (!errors.isEmpty()) {
        console.log('Invalid profile form request', errors.array());

        settings.invalidRequest(req, res, errors.array(), settings);
    } else next();
};

var checkExistsUsername = function checkExistsUsername(req, res, next) {
    var myId = (0, _database.getId)(req.user.user);

    (0, _database.repository)('account').findByUsername((0, _inflexAuthentication.authConfig)('loginWith'), req.body).then(function (existsData) {
        if (existsData.length > 0) {
            var existsDataTypes = [];

            _lodash2.default.forEach(existsData, function (account) {
                if (myId.toString() != account.identity_id.toString()) existsDataTypes.push(account.type);
            });

            if (existsDataTypes.length > 0) settings.existsUsername(req, res, existsDataTypes);else next();
        } else next();
    }).catch(function (err) {
        console.log(err);
    });
};

var addProfileService = function addProfileService(req, res, next) {
    req.update = function () {
        var p = new _profile2.default();

        p.user(req.user);
        p.update(req.body);
    };

    next();
};