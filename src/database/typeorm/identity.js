import { getManager } from 'typeorm';

import { model } from './../../database';

var identityRepository;

class IdentityRepository {
    insert (data) {
        let identity    = model('identity'),
            newIdentity = new identity();

        newIdentity.setData(data);

        return getManager()
            .save([ newIdentity ])
            .then(() => {
                return newIdentity;
            });
    }

    update (id, data) {
        let self = this;

        return getManager()
            .createQueryBuilder()
            .update(model('identity'))
            .set(data)
            .where('id = :id', { id: id })
            .execute()
            .then(() => {
                return self.findOneById(id);
            });
    }

    findOneById (id) {
        return getManager()
            .getRepository(model('identity'))
            .createQueryBuilder('identity')
            .where('identity.id = :id', { id : id })
            .getOne();
    }
}

export default function () {
    if (!identityRepository)
        identityRepository = new IdentityRepository();

    return identityRepository;
}