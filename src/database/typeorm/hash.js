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
        return getManager()
            .getRepository(model('hash'))
            .createQueryBuilder('hash')
            .where('hash.id = :hash', { id : hash })
            .where('hash.type = :type', { type : 2 })
            .getOne();
    }

    deleteByHash (hash) {
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