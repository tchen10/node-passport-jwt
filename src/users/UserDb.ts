import { cloudant } from '../config/db';
import { IUser, User } from './User';
import { logger } from '../config/logger';

export class UserDb {
    private db;

    constructor() {
        this.db = cloudant.use('users');
    }

    async create(user: User): Promise<any> {
        return this.db.insert({username: user.username, password: user.password});
    }

    async findByUsername(username: string): Promise<IUser> {
        const query = {
            selector: {
                username: username
            },
            fields: ['username', 'password']
        };

        const dbUserDocs = await this.db.find(query);
        logger.debug(`UserDb#findByUsername: found document`, dbUserDocs);

        if (dbUserDocs.docs.length < 1) {
            logger.info(`UserDb#findByUsername: user with username ${username} does not exist`);
            return null;
        }

        return dbUserDocs.docs[0];
    }
}