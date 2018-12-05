import _ from 'lodash';
import { getManager } from 'typeorm';

import { model } from './../../database';

var hashRepository;

class HashRepository {
    insert (data) {
        let hash    = model('hash'),
            newHash = new hash(0, data.identity_id, data.account_id, data.hash, data.type);

        return getManager()
            .save([ newHash ])
            .then(() => {
                return newHash;
            });
    }

    findHash (hash) {
        if (!hash)
            return;

        return getManager()
            .getRepository(model('hash'))
            .createQueryBuilder('hash')
            .where('hash.hash = :hash', { hash : hash })
            .andWhere('hash.type = :type', { type : 2 })
            .getOne();
    }

    deleteByHash (hash) {
        if (!hash)
            return;
            
        return getManager()
            .createQueryBuilder()
            .delete()
            .from(model('hash'))
            .where("hash = :hash", { hash: hash })
            .execute();
    }
}

export default function () {
    if (!hashRepository)
        hashRepository = new HashRepository();

    return hashRepository;
}