import { cloudant } from '../config/db';
import { User } from './User';
import { DbError } from '../errors/DbError';
import { logger } from '../config/logger';

export class UserDb {
    private db;

    constructor() {
        this.db = cloudant.use('users');
    }

    create(user: User): void {
        return this.db.insert({username: user.username, password: user.password}, (err, body) => {
            if (err) {
                throw new DbError(`UserDb#create failed for username ${user.username}.`);
            }
            logger.info(`UserDb#create successfully created user with id ${body['id']}`);
        });
    }
}