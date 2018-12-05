import _ from 'lodash';

import { repository, getId } from './../database';
import { createObject, successLoginInMiddleware, defineSettings, settingsByUrl } from 'inflex-authentication/helpers';

const defaultSettings = {
    'template' : {
        'failed' : 'activated-fail'
    }
};
var versionSettings = {};

function getCode (req) {
    return req.query['hash'] || req.body['hash'] || '0';
}

var checkCode = function (req, res, next) {
    let code = getCode(req);

    repository('hash')
        .findHash(code)
        .then(hash => {
            if (!hash) {
                let settings = settingsByUrl(req, versionSettings);

                res.render(settings.template.failed);
            } else {
                repository('identity')
                    .findOneById(hash.identity_id)
                    .then(identity => {
                        repository('identity')
                            .update(getId(identity), {
                                activated : true
                            });
        
                        repository('hash')
                            .deleteByHash(code)
        
                        createObject({
                            identity : getId(identity)
                        })
                        .then(userObject => {
                            successLoginInMiddleware(userObject, req, next);
                        });
                    })
            }
        })
        .catch(err => {
            console.log(err);
        });
}

export default function (options, middleware) {
    let version = options && options.version || 'default';

    middleware      = middleware || [];
    versionSettings = defineSettings(version, options, versionSettings, defaultSettings);

    var ret = middleware;

    ret.push(
        checkCode
    );

    return ret;
}