'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registrationRoute = registrationRoute;
exports.activateRoute = activateRoute;
exports.saveProfileRoute = saveProfileRoute;

var _inflexAuthentication = require('inflex-authentication');

var _registration = require('./registration');

//Registration
var needActivate = null;
var welcomeMail = null;
var registrationSuccess = function registrationSuccess(req, res) {
    if (welcomeMail && req.body.email) {
        req.userMail().welcome(res, req.body.email, welcomeMail.subject, 'welcome');
    }

    if (needActivate && req.body.email) {
        req.userMail().activate(res, req.body.email, needActivate.subject, 'activate');
    }

    req.token().generate(req.body.device).then(function (ret) {
        res.json({
            'error': false,
            'response': {
                'token': ret.token
            }
        });
    }).catch(function (err) {
        console.log(err);

        res.send('fail doJWTLogin');
    });
};

function registrationRoute(app, options) {
    options = options || {};

    needActivate = options.activate || null;
    welcomeMail = options.welcome || null;

    app.post('/api/registration', (0, _registration.registrationMiddleware)(), options.action || registrationSuccess);
}

//Activate
var activateView;
var activateSuccess = function activateSuccess(req, res) {
    res.render(activateView);
};

function activateRoute(app, options) {
    options = options || {};

    activateView = options.view || 'activated';

    app.get('/activate', (0, _registration.activateMiddleware)({
        'template': {
            'failed': 'activated-fail'
        }
    }), options.action || activateSuccess);
}

//Profile update
var profileUpdate = function profileUpdate(req, res) {
    req.update();

    res.json({
        'error': false
    });
};

function saveProfileRoute(app, options) {
    options = options || {};

    activateView = options.view || 'activated';

    app.put('/api/me', (0, _registration.profileMiddleware)(null, (0, _inflexAuthentication.needLogin)()), options.action || profileUpdate);
}