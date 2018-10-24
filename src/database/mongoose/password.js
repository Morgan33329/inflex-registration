import Promise from 'bluebird';

import { model } from './../../database';

var passwordRepository;

class PasswordRepository {
    insert (data) {
        return new Promise((resolve) => {
            model('password')
                .create(data, (err, result) => {
                    resolve(result);
                });
        });
    }

    update (id, data) {
        let self = this;

        return new Promise((resolve) => {
            model('password')
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
            model('password')
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }

    findPassword (identity) {
        return new Promise((resolve) => {
            model('password')
                .findOne({ 
                    'identity_id' : identity
                })
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }
}

export default function () {
    if (!passwordRepository)
        passwordRepository = new PasswordRepository();

    return passwordRepository;
}