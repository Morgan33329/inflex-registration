import { needLogin } from 'inflex-authentication';

import { 
    registrationMiddleware, 
    activateMiddleware, 
    profileMiddleware 
} from './registration';

//Registration
var needActivate = null;
var welcomeMail = null;
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

    req
        .token()
        .generate(req.body.device)
        .then((ret) => {
            res.json({
                'error' : false,
                'response' : {
                    'token' : ret.token
                }
            });
        })
        .catch(err => { 
            console.log(err);

            res.send('fail doJWTLogin');
        });
}

export function registrationRoute (app, options) {
    options = options || {};

    needActivate = options.activate || null;
    welcomeMail = options.welcome || null;

    app.post('/api/registration', registrationMiddleware(), options.action || registrationSuccess);
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