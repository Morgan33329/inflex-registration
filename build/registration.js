"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registrationRoutes = registrationRoutes;
exports.registrationMiddleware = registrationMiddleware;
exports.activateMiddleware = activateMiddleware;
exports.profileMiddleware = profileMiddleware;

var _registration = require("./middleware/registration");

var _registration2 = _interopRequireDefault(_registration);

var _activate = require("./middleware/activate");

var _activate2 = _interopRequireDefault(_activate);

var _profileUpdate = require("./middleware/profile-update");

var _profileUpdate2 = _interopRequireDefault(_profileUpdate);

var _route = require("./route");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create default routes for login if we are lazy
 */
function registrationRoutes(app, options) {
    options = options || {};

    (0, _route.saveProfileRoute)(app, options.saveProfile || {});

    (0, _route.activateRoute)(app, options.activate || {});

    (0, _route.registrationRoute)(app, options.registration || {});
}

function registrationMiddleware(options, middleware) {
    options = options || {};

    return (0, _registration2.default)(options, middleware);
}

function activateMiddleware(options, middleware) {
    options = options || {};

    return (0, _activate2.default)(options, middleware);
}

function profileMiddleware(options, middleware) {
    options = options || {};

    return (0, _profileUpdate2.default)(options, middleware);
}