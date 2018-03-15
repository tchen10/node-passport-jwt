import * as winston from 'winston';
import { config } from './index';

const timestamp = () => (new Date().toUTCString());

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            name: 'console',
            level: config.LOGGER.LEVEL,
            timestamp: timestamp(),
            colorize: true,
            silent: config.LOGGER.SILENT
        })
    ]
});

logger.exitOnError = false;

export { logger };