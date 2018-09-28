import _ from 'lodash';
import bcrypt from 'bcrypt';

import { authConfig } from 'inflex-authentication';

import { repository, getId } from './../database';

export default class {
    user (user) {
        this.userObject = user;

        return this;
    }

    update (data) {
        let myId = getId(this.userObject.user),
            
            loginWith = authConfig('loginWith');

        repository('account')
            .findAccountsByIdentity(myId)
            .then(accounts => {
                if (!accounts.length) {
                    console.log("No account found for update");

                    return;
                }

                var updateThis = {};

                _.forEach(loginWith, function(type, input) { 
                    if (data[input])
                        updateThis[type] = data[input]
                });

                _.forEach(accounts, function(account) { 
                    if (updateThis[account.type] && updateThis[account.type] != account.account) {
                        repository('account')
                            .update(getId(account), {
                                account : updateThis[account.type]
                            })
                            .then(() => {
                                console.log("Account updated " + account.account + " -> " + updateThis[account.type]);
                            });
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });

        if (data.password) {    
            repository('password')
                .findPassword(myId)
                .then(pwd => { 
                    var saltRounds = 10;

                    bcrypt.hash(data.password, saltRounds, function(err, hash) {
                        repository('password')
                            .update(getId(pwd), {
                                password : hash
                            })
                            .then(pwd => {
                                console.log("Password updated");
                            });
                    });
                })
                .catch(err => {
                    console.log(err);
                });;
        }
    }
}