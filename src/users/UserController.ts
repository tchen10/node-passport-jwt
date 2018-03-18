import { UserDb } from './UserDb';
import { User } from './User';
import { logger } from '../config/logger';

class UserController {

    public create = async (req, res) => {
        try {
            logger.debug(`UserController#create attempt to create user with username ${req.body.username}`);
            const newUser = new User(req.body.username, req.body.password);
            new UserDb().create(newUser);
            res.status(201).json({message: 'User saved successfully!'});
        } catch (err) {
            logger.error(`UserController#create failed. ${err}`);
            res.status(400).json({message: 'Bad request', errors: err});
        }
    };
}

export default new UserController();