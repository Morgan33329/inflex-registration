'use strict';

const dir = process.env.DEVELOPER ? 'src' : 'build'; 

const registration = require('./' + dir + '/registration');

exports.registrationRoutes = registration.registrationRoutes;