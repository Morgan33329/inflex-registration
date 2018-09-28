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
export function registrationRoutes (app, options) {
    options = options || {};

    saveProfileRoute(app, options.saveProfile || {});

    activateRoute(app, options.activate || {});

    registrationRoute(app, options.registration || {});
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