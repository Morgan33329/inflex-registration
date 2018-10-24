import passwordRepository from './typeorm/password';
import identityRepository from './typeorm/identity';
import accountRepository from './typeorm/account';
import hashRepository from './typeorm/hash';

export default function (type) {
    switch (type) {
        case 'account':
            return accountRepository();
        case 'identity':
            return identityRepository();
        case 'password':
            return passwordRepository();
        case 'hash':
            return hashRepository();
        default:
            console.log('Invalid repository type: ' + type);
    }
} 