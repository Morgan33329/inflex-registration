import passwordRepository from './mongo/password';
import identityRepository from './mongo/identity';
import accountRepository from './mongo/account';
import hashRepository from './mongo/hash';

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