import { cloudant } from '../config/db';
import { IUser, User } from './User';
import { logger } from '../config/logger';
import { NotFoundError } from '../errors/NotFoundError';

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
            fields: ['username', 'password'
            ]
        };

        const dbUserDocs = await this.db.find(query);
        logger.debug(`UserDb#findByUsername found document`, dbUserDocs);

        if (dbUserDocs.length > 1) {
            logger.info(`UserDb#findByUsername found more than one document matching ${username}`);
        }

        if (dbUserDocs.length < 1) {
            throw new NotFoundError(`User with username ${username} does not exist`);
        }

        return dbUserDocs.docs[0];
    }
}