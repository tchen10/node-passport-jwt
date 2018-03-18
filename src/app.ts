import * as bodyParser from 'body-parser';
import { config } from './config';

const express = require('express');
const expressValidator = require('express-validator');

const app = express();

app.use(bodyParser.json());
app.use(expressValidator());

require('./auth/AuthRoutes')(app);
require('./users/UserRoutes')(app);

app.get('/', (req, res) => res.status(200).json({message: `Application is running on ${config.PORT} in ${config.ENV}`}));

export { app };