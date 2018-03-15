const config = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    LOGGER: {
        LEVEL: process.env.LOG_LEVEL || 'debug',
        SILENT: process.env.LOG_SILENT || false
    }
};

export { config as defaultConfig };
