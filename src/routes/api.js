import { needLogin } from 'inflex-authentication';
import { routeAction } from 'inflex-authentication/helpers';

import { 
    registrationMiddleware, 
    profileMiddleware 
} from './../registration';

//Registration
/*
var registrationSuccess = function (req, res) {
    if (welcomeMail && req.body.email) {
        req
            .userMail()
            .welcome(res, req.body.email, welcomeMail.subject, 'welcome');
    }

    if (needActivate && req.body.email) {
        req
            .userMail()
            .activate(res, req.body.email, needActivate.subject, 'activate');
    }
}
*/

export function registrationRoute (app, options, version) {
    options = options || {};

    app.post(
        (version ? '/' + version : '') + '/api/register', 
        registrationMiddleware({
            'version' : version
        }), 
        (req, res, next) => {
            routeAction('login', req, options.action)(req, res, next);
        }
    );
}

//Profile update
var profileUpdate = function (req, res) {
    req.update();

    res.json({
        'error' : false
    });
}

export function saveProfileRoute (app, options, version) {
    options = options || {};

    app.put(
        (version ? '/' + version : '') + '/api/me', 
        profileMiddleware({
            'version' : version
        }, needLogin()), 
        options.action || profileUpdate
    );
}