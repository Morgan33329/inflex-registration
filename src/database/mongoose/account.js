import _ from 'lodash';
import Promise from 'bluebird';

import { model } from './../../database';

var accountRepository;

class AccountRepository {
    insert (data) {
        return new Promise((resolve) => {
            model('account')
                .create(data, (err, result) => {
                    resolve(result);
                });
        });
    }

    update (id, data) {
        let self = this;

        return new Promise((resolve) => {
            model('account')
                .updateOne({ 
                    '_id' : id 
                }, data, () => {
                    self.findOneById(id)
                        .then(account => {
                            resolve(account);
                        });
                });
        });
    }

    findOneById (id) {    
        return new Promise((resolve) => {
            model('account')
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }

    findAccountsByIdentity (id) {
        return new Promise((resolve) => {
            model('account')
                .find({ 
                    identity_id: id
                })
                .then((results) => {
                    resolve(results);
                });
        });
    }

    findByUsername (loginWith, request) {
        var query   = model('account'),
            whereOr = [];

        _.forEach(loginWith, function(type, input) {
            if (request[input]) {
                whereOr.push({'account': request[input]})
            }
        });

        return new Promise((resolve) => {
            query
                .find({
                    $or: whereOr
                })
                .exec((err, accounts) => {
                    resolve(accounts);
                })
        });
    }
}
export default function () {
    if (!accountRepository)
        accountRepository = new AccountRepository();

    return accountRepository;
}