import { needLogin, authConfig } from 'inflex-authentication';

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

export function registrationRoute (app, options) {
    options = options || {};

    let action = options.action || authConfig('actions.login');

    app.post(
        '/api/registration', 
        registrationMiddleware(), 
        action
    );
}

//Activate
var activateView;
var activateSuccess = function (req, res) {
    res.render(activateView);
}

export function activateRoute (app, options) {
    options = options || {};

    activateView = options.view || 'activated';

    app.get('/activate', activateMiddleware({
        'template' : {
            'failed' : 'activated-fail',
        }
    }), options.action || activateSuccess);
}

//Profile update
var profileUpdate = function (req, res) {
    req.update();

    res.json({
        'error' : false
    });
}

export function saveProfileRoute (app, options) {
    options = options || {};

    activateView = options.view || 'activated';

    app.put(
        '/api/me', 
        profileMiddleware(null, needLogin()), 
        options.action || profileUpdate
    );
}