'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (options, middleware) {
    settings = _lodash2.default.merge(defaultSettings, options || {});

    if (!settings.invalidRequest) {
        console.log('ERROR: You need define "invalidRequest" for register middleware');
        process.exit(1);
    } else if (!settings.existsUsername) {
        console.log('ERROR: You need define "existsUsername" for register middleware');
        process.exit(1);
    }

    var ret = validateUsername(middleware || []);

    ret.push(validatePassword, isValidRequest, checkExistsUsername, registerUser);

    return ret;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _inflexAuthentication = require('inflex-authentication');

var _helpers = require('inflex-authentication/helpers');

var _check = require('express-validator/check');

var _database = require('./../database');

var _user = require('./../services/user');

var _user2 = _interopRequireDefault(_user);

var _email = require('./../services/email');

var _email2 = _interopRequireDefault(_email);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSettings = {
    'invalidRequest': function invalidRequest(req, res, errors) {
        return res.status(422).json({
            'error': true,
            'code': '4220301',
            'type': '',
            'title': 'Invalid registration request',
            'detail': 'Invalid registration request: ' + JSON.stringify(errors)
        });
    },

    'existsUsername': function existsUsername(req, res, types) {
        return res.status(422).json({
            'error': true,
            'code': '4220302',
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
        if (validateInputs[input]) inputValidators.push(validateInputs[input]((0, _check.check)(input)));
    });

    return inputValidators;
};

var validatePassword = function validatePassword(req, res, next) {
    var validateInputs = (0, _inflexAuthentication.authConfig)('validateInputs');

    validateInputs.password((0, _check.check)('password'))(req, res, next);
};

var isValidRequest = function isValidRequest(req, res, next) {
    var errors = (0, _check.validationResult)(req);

    if (!errors.isEmpty()) {
        console.log('Invalid register form request', errors.array());

        settings.invalidRequest(req, res, errors.array(), settings);
    } else next();
};

var checkExistsUsername = function checkExistsUsername(req, res, next) {
    (0, _database.repository)('account').findByUsername((0, _inflexAuthentication.authConfig)('loginWith'), req.body).then(function (existsData) {
        if (existsData.length > 0) {
            var existsDataTypes = [];

            _lodash2.default.forEach(existsData, function (account) {
                existsDataTypes.push(account.type);
            });

            settings.existsUsername(req, res, existsDataTypes);
        } else next();
    }).catch(function (err) {
        console.log(err);
    });
};

var registerUser = function registerUser(req, res, next) {
    var userService = new _user2.default();

    userService.createWithUsernameAndPassword((0, _inflexAuthentication.authConfig)('loginWith'), req.body).then(function (identity) {
        (0, _helpers.createObject)({
            identity: (0, _database.getId)(identity)
        }).then(function (userObject) {
            req.userMail = function () {
                var emailService = new _email2.default();

                emailService.user(userObject);

                return emailService;
            };
            (0, _helpers.successLoginInMiddleware)(userObject, req, next);
        });
    }).catch(function (err) {
        console.log(err);
    });
};