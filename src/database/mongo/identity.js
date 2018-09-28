import Promise from 'bluebird';

import { model } from './../../database';

var identityRepository;

class IdentityRepository {
    insert (data) {
        return new Promise((resolve) => {
            model('identity')
                .create(data, (err, result) => {
                    resolve(result);
                });
        });
    }

    update (id, data) {
        let self = this;

        return new Promise((resolve) => {
            model('identity')
                .updateOne({ 
                    '_id' : id 
                }, data, () => {
                    self.findOneById(id)
                        .then(password => {
                            resolve(password);
                        });
                });
        });
    }

    findOneById (id) {
        return new Promise((resolve) => {
            model('identity')
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
            });
    }
}

export default function () {
    if (!identityRepository)
        identityRepository = new IdentityRepository();

    return identityRepository;
}