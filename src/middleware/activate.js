import _ from 'lodash';

import { repository } from './../database';

var defaultSettings = {
    'template' : {
        'failed' : 'activated-fail'
    }
};
var settings = defaultSettings;

function getCode (req) {
    return req.query['hash'] || req.body['hash'];
}

var checkCode = function (req, res, next) {
    let code = getCode(req);

    repository('hash')
        .findHash(code)
        .then(hash => {
            if (!hash) {
                res.render(settings.template.failed);
            } else {
                repository('identity')
                    .update(hash.identity_id, {
                        activated : true
                    });

                repository('hash')
                    .deleteByHash(code)

                next();
            }
        })
        .catch(err => {
            console.log(err);
        });
}

export default function (options, middleware) {
    settings = _.merge(defaultSettings, options || {});

    var ret = middleware || [];

    ret.push(
        checkCode
    );

    return ret;
}