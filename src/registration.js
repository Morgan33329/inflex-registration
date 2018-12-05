import registration from "./middleware/registration";
import activate from "./middleware/activate";
import profile from "./middleware/profile-update";

import { registrationRoute, saveProfileRoute } from './routes/api';

import { activateRoute } from './routes/web';

/**
 * Create default routes for login if we are lazy
 */
export function registrationApiRoutes (app, version, options) {
    if (typeof version === 'object' && !options) {
        options = version;
        version = null;
    }

    options = options || {};

    saveProfileRoute(app, options.saveProfile || {}, version);

    registrationRoute(app, options.registration || {}, version);
}

export function registrationWebRoutes (app, options) {
    options = options || {};

    activateRoute(app, options.activate || {});

}

// Middlewares

export function registrationMiddleware (options, middleware) {
    options = options || {};

    return registration(options, middleware);
}

export function activateMiddleware (options, middleware) {
    options = options || {};

    return activate(options, middleware);
}

export function profileMiddleware (options, middleware) {
    options = options || {};

    return profile(options, middleware);
}