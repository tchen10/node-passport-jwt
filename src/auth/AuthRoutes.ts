import { config } from '../config';
import AuthController from './AuthController';

export = (app) => {
    const endpoint = config.API_BASE;

    app.post(endpoint + 'login', AuthController.login);
};