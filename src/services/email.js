import nodemailer from 'nodemailer';
import crypto from 'crypto';

import { authConfig } from 'inflex-authentication';

import { repository, getId } from './../database';

function defineParameters (to, from, template) {
    if (!from) {
        let email = authConfig('mailTransport.auth.user');

        from = {
            'email' : email,
            'name' : email
        };
    }

    let templateIsObject = template && typeof template === 'object',
        toIsObject = to && typeof to === 'object',
        fromIsObject = from && typeof from === 'object',

        parameters = templateIsObject && template.parameters ? template.parameters : {},
        view = templateIsObject && template.view ? template.view : template,
        
        toEmail = toIsObject ? to.email : to,
        toName  = toIsObject ? to.name : undefined,
        
        fromEmail = fromIsObject ? from.email : from,
        fromName  = fromIsObject ? from.email : undefined;

    if (!view) {
        console.log('ERROR: You need define view for message');
        process.exit(1);
    }

    return {
        'from' : {
            'email' : fromEmail,
            'name' : fromName
        },
        'to' : {
            'email' : toEmail,
            'name' : toName
        },
        'view' : {
            'parameters' : parameters,
            'file' : view
        }
    };
}

function createHash (identity) {
    return crypto.createHash('md5').update(identity + '_activate_' + new Date().getTime()).digest('hex');
}

export default class {
    user (user) {
        this.userData = user;
    }

    welcome (res, to, subject, template, from) {
        let p = defineParameters(to, from, template);

        res.render(p.view.file, p.view.parameters, function(err, html) {
            if (err) return console.log(err);

            nodemailer
                .createTransport(authConfig('mailTransport'))
                .sendMail({
                    from: p.from.email,
                    subject: subject,
                    html : html,
                    to : p.to.email
                }, (error, info) => {
                    if (!error)
                        console.log('Welcome mail sent');
                    else
                        console.log('Welcome email send error', error);
                });
        });
    }

    activate (res, to, subject, template, from) {
        let identityId = getId(this.userData.user),
            
            activateUrl = "/activate";

        repository('identity')
            .update(identityId, {
                'activated' : false
            });

        repository('hash')
            .insert({
                'identity_id' : identityId,
                'hash' : createHash(identityId),
                'type' : 2
            })
            .then(hash => {
                let p = defineParameters(to, from, template);

                p.view.parameters["url"] = authConfig('host') + activateUrl + '?hash=' + hash.hash;

                res.render(p.view.file, p.view.parameters, function(err, html) {
                    if (err) return console.log(err);

                    nodemailer
                        .createTransport(authConfig('mailTransport'))
                        .sendMail({
                            from: p.from.email,
                            subject: subject,
                            html : html,
                            to : p.to.email
                        }, (error, info) => {
                            if (!error)
                                console.log('Activate email sent');
                            else
                                console.log('Activatea email send error', error);
                        });
                });
            });
    }
}