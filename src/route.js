import { needLogin } from 'inflex-authentication';
import { routeAction } from 'inflex-authentication/helpers';

import { 
    registrationMiddleware, 
    activateMiddleware, 
    profileMiddleware 
} from './registration';

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
        (version ? '/' + version : '') + '/api/registration', 
        registrationMiddleware({
            'version' : version
        }), 
        (req, res, next) => {
            routeAction('login', req, options.action)(req, res, next);
        }
    );
}

//Activate
var activateView;
var activateSuccess = function (req, res) {
    res.render(activateView);
}

export function activateRoute (app, options, version) {
    options = options || {};

    activateView = options.view || 'activated';

    app.get(
        '/activate', 
        activateMiddleware({
            'version' : version,
            'template' : {
                'failed' : 'activated-fail',
            }
        }), 
        options.action || activateSuccess
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

    activateView = options.view || 'activated';

    app.put(
        (version ? '/' + version : '') + '/api/me', 
        profileMiddleware({
            'version' : version
        }, needLogin()), 
        options.action || profileUpdate
    );
}