import { getManager } from 'typeorm';

import { model } from './../../database';

var passwordRepository;

class PasswordRepository {
    insert (data) {
        let password    = model('password'),
            newPassword = new password(0, data.identity_id, data.password);

        return getManager()
            .save([ newPassword ])
            .then(() => {
                return newPassword;
            });
    }

    update (id, data) {
        if (!id)
            return;

        let self = this;

        return getManager()
            .createQueryBuilder()
            .update(model('password'))
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
            .getRepository(model('password'))
            .createQueryBuilder('password')
            .where('password.id = :id', { id : id })
            .getOne();
    }

    findPassword (identity) {
        if (!identity)
            return;

        return getManager()
            .getRepository(model('password'))
            .createQueryBuilder('password')
            .where('password.identity_id = :identity', { identity : identity })
            .getOne();
    }
}

export default function () {
    if (!passwordRepository)
        passwordRepository = new PasswordRepository();

    return passwordRepository;
}