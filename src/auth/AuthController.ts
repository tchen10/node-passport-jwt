import * as jwt from 'jwt-simple';
import { IUser, User } from '../users/User';
import { logger } from '../config/logger';
import { UserDb } from '../users/UserDb';
import moment = require('moment');

class AuthController {
    public login = async (req, res) => {
        try {
            logger.info(`AuthController#login: Logging in username ${req.body.username}`);

            const dbUser = await new UserDb().findByUsername(req.body.username);
            const success = User.comparePassword(req.body.password, dbUser.password);

            if (success === false) throw 'Invalid Credentials';

            res.status(200).json(this.generateToken(dbUser));
        } catch (err) {
            res.status(401).json({message: 'Invalid credentials'});
        }
    };

    private generateToken = (user: IUser): Object => {
        const expires = moment().utc().add({days: 1}).unix();
        const token = jwt.encode({
            exp: expires,
            username: user.username
        }, process.env.JWT_SECRET);

        return {
            token: 'JWT' + token,
            expires: moment.unix(expires).format(),
            username: user.username
        };
    };
}

export default new AuthController();