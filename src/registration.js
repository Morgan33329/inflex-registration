import registration from "./middleware/registration";
import activate from "./middleware/activate";
import profile from "./middleware/profile-update";

import {
     registrationRoute, 
     activateRoute, 
     saveProfileRoute 
} from './route';

/**
 * Create default routes for login if we are lazy
 */
export function registrationRoutes (app, version, options) {
    if (typeof version === 'object' && !options) {
        options = version;
        version = null;
    }

    options = options || {};

    saveProfileRoute(app, options.saveProfile || {}, version);

    activateRoute(app, options.activate || {}, version);

    registrationRoute(app, options.registration || {}, version);
}

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