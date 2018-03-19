const config = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'superSecret',
    API_BASE: process.env.API_BASE || '/api/v1/',
    LOGGER: {
        LEVEL: process.env.LOG_LEVEL || 'debug',
        SILENT: process.env.LOG_SILENT || false
    },
    DB: {
        ACCOUNT: process.env.DB_ACCOUNT || 'account',
        PASSWORD: process.env.DB_PASSWORD || 'password'
    }
};

export { config as defaultConfig };
