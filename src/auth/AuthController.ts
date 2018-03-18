import * as jwt from 'jwt-simple';
import { IUser, User } from '../users/User';
import { logger } from '../config/logger';
import { UserDb } from '../users/UserDb';
import moment = require('moment');
import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { NotFoundError } from '../errors/NotFoundError';

class AuthController {
    public initialize = () => {
        passport.use('jwt', this.getStrategy());
        passport.initialize();
    };

    public authenticate = async (req, res, next) => {
        if (req.path.includes(process.env.API_BASE + 'login')) return next();

        logger.info('authenticating user');

        passport.authenticate('jwt', {session: false, failWithError: true}, (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                if (info.name === 'TokenExpiredError') {
                    return res.status(401).json({message: 'Your token has expired. Please generate a new one'});
                } else {
                    return res.status(401).son({message: info.message});
                }
            }

            return next();
        })(req, res, next);
    };

    public login = async (req, res) => {
        try {
            logger.info(`AuthController#login: Logging in username ${req.body.username}`);

            const dbUser = await new UserDb().findByUsername(req.body.username);
            const success = User.comparePassword(req.body.password, dbUser.password);

            if (success === false) throw 'Invalid Credentials';

            res.status(200).json(this.generateToken(dbUser));
        } catch (err) {
            if (err instanceof NotFoundError) {
                res.status(404).json({message: 'Username does not exist'});
            } else {
                res.status(401).json({message: 'Invalid credentials'});
            }
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

    private getStrategy = () => {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            passReqToCallback: true
        };

        return new Strategy(params, (req, payload: any, done) => {
            return new UserDb().findByUsername(payload.username)
                .then(data => {
                    if (data === null) {
                        return done(null, false, {message: 'The user in the token was not found'});
                    }

                    return done(null, {username: data.username});
                })
                .catch(err => {
                    return done(err);
                });
        });
    };
}

export default new AuthController();