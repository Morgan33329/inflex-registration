'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _inflexAuthentication = require('inflex-authentication');

var _database = require('./../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function defineParameters(to, from, template) {
    if (!from) {
        var email = (0, _inflexAuthentication.authConfig)('mailTransport.auth.user');

        from = {
            'email': email,
            'name': email
        };
    }

    var templateIsObject = template && (typeof template === 'undefined' ? 'undefined' : _typeof(template)) === 'object',
        toIsObject = to && (typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object',
        fromIsObject = from && (typeof from === 'undefined' ? 'undefined' : _typeof(from)) === 'object',
        parameters = templateIsObject && template.parameters ? template.parameters : {},
        view = templateIsObject && template.view ? template.view : template,
        toEmail = toIsObject ? to.email : to,
        toName = toIsObject ? to.name : undefined,
        fromEmail = fromIsObject ? from.email : from,
        fromName = fromIsObject ? from.email : undefined;

    if (!view) {
        console.log('ERROR: You need define view for message');
        process.exit(1);
    }

    return {
        'from': {
            'email': fromEmail,
            'name': fromName
        },
        'to': {
            'email': toEmail,
            'name': toName
        },
        'view': {
            'parameters': parameters,
            'file': view
        }
    };
}

function createHash(identity) {
    return _crypto2.default.createHash('md5').update(identity + '_activate_' + new Date().getTime()).digest('hex');
}

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'user',
        value: function user(_user) {
            this.userData = _user;
        }
    }, {
        key: 'welcome',
        value: function welcome(res, to, subject, template, from) {
            var p = defineParameters(to, from, template);

            res.render(p.view.file, p.view.parameters, function (err, html) {
                if (err) return console.log(err);

                _nodemailer2.default.createTransport((0, _inflexAuthentication.authConfig)('mailTransport')).sendMail({
                    from: p.from.email,
                    subject: subject,
                    html: html,
                    to: p.to.email
                }, function (error, info) {
                    if (!error) console.log('Welcome mail sent');else console.log('Welcome email send error', error);
                });
            });
        }
    }, {
        key: 'activate',
        value: function activate(res, to, subject, template, from) {
            var identityId = (0, _database.getId)(this.userData.user),
                activateUrl = "/activate";

            (0, _database.repository)('identity').update(identityId, {
                'activated': false
            });

            (0, _database.repository)('hash').insert({
                'hash': createHash(identityId),
                'type': 2
            }).then(function (hash) {
                var p = defineParameters(to, from, template);

                p.view.parameters["url"] = (0, _inflexAuthentication.authConfig)('host') + activateUrl + '?hash=' + hash.hash;

                res.render(p.view.file, p.view.parameters, function (err, html) {
                    if (err) return console.log(err);

                    _nodemailer2.default.createTransport((0, _inflexAuthentication.authConfig)('mailTransport')).sendMail({
                        from: p.from.email,
                        subject: subject,
                        html: html,
                        to: p.to.email
                    }, function (error, info) {
                        if (!error) console.log('Activate email sent');else console.log('Activatea email send error', error);
                    });
                });
            });
        }
    }]);

    return _class;
}();

exports.default = _class;