import passwordRepository from './mongoose/password';
import identityRepository from './mongoose/identity';
import accountRepository from './mongoose/account';
import hashRepository from './mongoose/hash';

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