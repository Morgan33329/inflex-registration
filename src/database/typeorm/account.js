import _ from 'lodash';
import { getManager } from 'typeorm';

import { model } from './../../database';

var accountRepository;

class AccountRepository {
    insert (data) {
        let account    = model('account'),
            newAccount = new account(0, data.identity_id, data.account, data.type);

        return getManager()
            .save([ newAccount ])
            .then(() => {
                return newAccount;
            });
    }

    update (id, data) {
        if (!id)
            return;
            
        let self = this;

        return getManager()
            .createQueryBuilder()
            .update(model('account'))
            .set(data)
            .where('id = :id', { id: id })
            .execute()
            .then(() => {
                return self.findOneById(id);
            });
    }

    findOneById (id) {    
        if (!id)
            return;

        return getManager()
            .getRepository(model('account'))
            .createQueryBuilder('account')
            .where('account.id = :id', { id : id })
            .getOne();
    }

    findAccountsByIdentity (id) {
        if (!id)
            return;

        return getManager()
            .getRepository(model('account'))
            .createQueryBuilder('account')
            .where('account.identity_id = :id', { id : id })
            .getMany();
    }

    findByUsername (loginWith, request) {
        var query = getManager()
            .getRepository(model('account'))
            .createQueryBuilder('account');

        _.forEach(loginWith, function(type, input) {
            if (request[input])
                query = query.orWhere('account.account = :account', { account : request[input] })
        });

        return query.getMany();
    }
}
export default function () {
    if (!accountRepository)
        accountRepository = new AccountRepository();

    return accountRepository;
}