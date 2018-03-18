import { config } from '../config';
import AuthController from './AuthController';
import * as passport from 'passport';

export = (app) => {
    const endpoint = config.API_BASE;

    app.use(AuthController.initialize);

    app.all(endpoint + '*', (req, res, next) => {
        console.log('authenticating');
        if (req.path.includes(process.env.API_BASE + 'login')) return next();

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
    });

    app.post(endpoint + 'login', AuthController.login);
};