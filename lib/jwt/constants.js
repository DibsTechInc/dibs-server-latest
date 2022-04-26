const { userIncludeConfig, employeeIncludeConfig } = require('../../config/passport/include-config');

const { AES_SECRET, JWT_SECRET, COOKIE_SECRET, NOTIFY_ON_EXPIRED_TOKEN } = process.env;

const TOKEN_KEYS = {
    user: 'userId',
    employee: 'employeeId'
};

const MODELS = {
    user: 'dibs_user',
    employee: 'studio_employee'
};

const PATHS = {
    user: '/',
    employee: '/studios'
};

const INCLUDE_CONFIGS = {
    user: userIncludeConfig,
    employee: employeeIncludeConfig
};

const SESSION_EXPIRATION_TIME = Number.isNaN(process.env.SESSION_DURATION_IN_DAYS)
    ? 7 * 24 * 60 ** 2
    : Number(process.env.SESSION_DURATION_IN_DAYS) * 24 * 60 ** 2; // convert to seconds

module.exports = {
    AES_SECRET,
    JWT_SECRET,
    COOKIE_SECRET,
    NOTIFY_ON_EXPIRED_TOKEN,
    TOKEN_KEYS,
    MODELS,
    PATHS,
    INCLUDE_CONFIGS,
    SESSION_EXPIRATION_TIME
};
