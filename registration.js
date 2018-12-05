'use strict';

const dir = ["true", "1", 1, true].indexOf(process.env.DEVELOPER) != -1 ? 'src' : 'lib'; 

const registration = require('./' + dir + '/registration');

exports.registrationApiRoutes = registration.registrationApiRoutes;

exports.registrationWebRoutes = registration.registrationWebRoutes;