import _ from 'lodash';
import Promise from 'bluebird';

import { model } from './../../database';

var hashRepository;

class HashRepository {
    insert (data) {console.log(data);
        return new Promise((resolve) => {
            model('hash')
                .create(data, (err, result) => {
                    resolve(result);
                });
        });
    }

    findHash (hash) {
        return new Promise((resolve) => {
            model('hash')
                .findOne({ 
                    'hash' : hash,
                    'type' : 2
                })
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }

    deleteByHash (hash) {
        return new Promise((resolve) => {
            model('hash')
                .deleteOne({
                    'hash' : hash
                }, function (err) {
                    resolve()
                });
        });
    }
}

export default function () {
    if (!hashRepository)
        hashRepository = new HashRepository();

    return hashRepository;
}