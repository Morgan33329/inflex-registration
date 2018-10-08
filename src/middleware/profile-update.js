import _ from 'lodash';
import { check, validationResult } from 'express-validator/check';

import { authConfig } from 'inflex-authentication';

import { repository, getId } from '../database';
import profile from '../services/profile';

var defaultSettings = {
    'invalidRequest' : (req, res, errors) => {
        return res.status(422).json({ 
            'success' : false,
            'error' : {
                'code' : '4220303',
                'type' : '',
                'title' : 'Invalid registration request',
                'detail' : 'Invalid registration request: ' + JSON.stringify(errors)
            }
        });
    },

    'existsUsername' : (req, res, types) => {
        return res.status(422).json({ 
            'success' : false,
            'error' : {
                'code' : '4220304',
                'type' : '',
                'title' : 'Someone registered with this data',
                'detail' : 'This register data exists in database'
            }
        });
    }
};
var settings = defaultSettings;

var validateUsername = function(inputValidators) {
    let validateInputs = authConfig('validateInputs');

    _.forEach(authConfig('loginWith'), function(type, input) {
        if (validateInputs[input])
            inputValidators.push((req, res, next) => {
                if (req.body[input])
                    validateInputs[input](check(input))(req, res, next);
                else
                    next();
            });
    });

    return inputValidators;
}

var validatePassword = function(req, res, next) {
    let validateInputs = authConfig('validateInputs');

    if (req.body.password) { 
        validateInputs.password(check('password'))(req, res, next);
    } else
        next();
}

var isValidRequest = function(req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Invalid profile form request', errors.array());

        settings.invalidRequest(req, res, errors.array(), settings);
    } else
        next();
}

var checkExistsUsername = function(req, res, next) {
    let myId = getId(req.user.user);

    repository('account')
        .findByUsername(authConfig('loginWith'), req.body)
        .then(existsData => {
            if (existsData.length > 0) {
                var existsDataTypes = [];

                _.forEach(existsData, function(account) { 
                    if (myId.toString() != account.identity_id.toString())
                        existsDataTypes.push(account.type);
                });

                if (existsDataTypes.length > 0)
                    settings.existsUsername(req, res, existsDataTypes);
                else
                    next();
            } else
                next();
        })
        .catch(err => {
            console.log(err);
        });
}

var addProfileService = function(req, res, next) {
    req.update = function() {
        var p = new profile();

        p.user(req.user);
        p.update(req.body);
    };

    next();
} 

export default function (options, middleware) {
    settings = _.merge(defaultSettings, options || {});

    var ret = validateUsername(middleware || []);

    ret.push(
        validatePassword,
        isValidRequest,

        checkExistsUsername,

        addProfileService
    );

    return ret;
}