import _ from 'lodash';

import { authConfig } from 'inflex-authentication';
import { createObject, successLoginInMiddleware, routeMiddleware } from 'inflex-authentication/helpers';
import { check, validationResult } from 'express-validator/check';

import { repository, getId } from './../database';

import UserService from './../services/user';
import EmailService from './../services/email'

var defaultSettings = {
    'invalidRequest' : function(req, res, errors) {
        return res.status(422).json({ 
            'error' : true,
            'code' : '4220301',
            'type' : '',
            'title' : 'Invalid registration request',
            'detail' : 'Invalid registration request: ' + JSON.stringify(errors)
        });
    },

    'existsUsername' : function(req, res, types) {
        return res.status(422).json({ 
            'error' : true,
            'code' : '4220302',
            'type' : '',
            'title' : 'Someone registered with this data',
            'detail' : 'This register data exists in database'
        });
    }
};
var settings = defaultSettings;

var validateUsername = function(inputValidators) {
    let validateInputs = authConfig('validateInputs');

    _.forEach(authConfig('loginWith'), function(type, input) {
        if (validateInputs[input])
            inputValidators.push(
                validateInputs[input](check(input))
            );
    });

    return inputValidators;
}

var validatePassword = function(req, res, next) {
    let validateInputs = authConfig('validateInputs');

    validateInputs.password(check('password'))(req, res, next);
}

var isValidRequest = function(req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Invalid register form request', errors.array());

        settings.invalidRequest(req, res, errors.array(), settings);
    } else
        next();
}

var checkExistsUsername = function(req, res, next) {
    repository('account')
        .findByUsername(authConfig('loginWith'), req.body)
        .then(existsData => {
            if (existsData.length > 0) {
                var existsDataTypes = [];

                _.forEach(existsData, function(account) {
                    existsDataTypes.push(account.type);
                });

                settings.existsUsername(req, res, existsDataTypes);
            } else
                next();
        })
        .catch(err => {
            console.log(err);
        });
}

var registerUser = function(req, res, next) {
    let userService = new UserService();

    userService
        .createWithUsernameAndPassword(authConfig('loginWith'), req.body)
        .then(identity => {
            createObject({
                identity : getId(identity)
            })
            .then(userObject => {
                req.userMail = function() {
                    let emailService = new EmailService(); 

                    emailService.user(userObject);

                    return emailService;
                }

                req.newRegistration = true;

                successLoginInMiddleware(userObject, req, next);
            })
        })
        .catch(err => {
            console.log(err);
        });
}

var newUser = function (req, res, next) {
    if (req.newRegistration) {
        let middleware = routeMiddleware('registration', settings.version);

        if (middleware)
            return middleware(req, res, next);
    }

    next();
}

export default function (options, middleware) {
    settings = _.merge(defaultSettings, options || {});

    if (!settings.invalidRequest) {
        console.log('ERROR: You need define "invalidRequest" for register middleware');
        process.exit(1);
    } else if (!settings.existsUsername) {
        console.log('ERROR: You need define "existsUsername" for register middleware');
        process.exit(1);
    }

    var ret = validateUsername(middleware || []);

    ret.push(
        validatePassword,
        isValidRequest,

        checkExistsUsername,

        registerUser,

        newUser
    );

    return ret;
}