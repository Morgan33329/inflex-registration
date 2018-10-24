import _ from 'lodash';
import Bluebird from 'bluebird';
import bcrypt from 'bcrypt';

import { repository, getId } from './../database';

function createAccount (acc, type, identity) {
    return repository('account')
        .insert({
            'identity_id' : identity,
            'account' : acc,
            'type' : type
        })
        .then(account => {
            console.log('Account: ' + acc + ' uploaded');

            return account;
        });
}

function createIdentity (activated, enabled, blocked) {
    activated = !activated ? true : false; 
    enabled = !enabled ? true : false; 
    blocked = blocked ? true : false; 

    return repository('identity')
        .insert({
            'activated' : activated,
            'enabled' : enabled,
            'blocked' : blocked
        })
        .then(identity => {
            console.log('Identity uploaded');

            return identity;
        });
}

function createPassword (password, identity) {
    return new Bluebird((resolve, reject) => {
        var saltRounds = 10;

        bcrypt.hash(password, saltRounds, function(err, hash) {
            repository('password')
                .insert({
                    'identity_id' : identity,
                    'password' : hash
                })
                .then(password => {
                    console.log('Password uploaded');
                    
                    resolve(password);
                });
        });
    });
}

export default class {
    createWithUsernameAndPassword (loginWith, request) {
        return createIdentity()
            .then(identity => {
                var accountIds = [];
console.log(identity, getId(identity));
                _.forEach(loginWith, function(type, input) {
                    if (request[input]) {
                        createAccount(request[input], type, getId(identity));
                    
                        accountIds.push();
                    }
                });

                createPassword(request.password, identity.id);

                return identity;
            })
            .catch(err => {
                console.log(err);
            });
    }
}
