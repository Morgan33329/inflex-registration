import { needLogin } from 'inflex-authentication';
import { routeAction } from 'inflex-authentication/helpers';

import { activateMiddleware } from './../registration';

//Activate
var activateView;
var activateSuccess = function (req, res) { console.log('CICAAAA', req.user);
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