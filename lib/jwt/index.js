const jwt = require('jsonwebtoken');
const { Router } = require('express');
const Cookies = require('cookies');
const { handleError } = require('../errors');
const { updateInstance, retrieveJSON } = require('@dibs-tech/redis-interface');
const MailClient = require('@dibs-tech/mail-client');
const models = require('@dibs-tech/models');
const { createCipheriv } = require('crypto');

const {
    SESSION_EXPIRATION_TIME,
    TOKEN_KEYS,
    MODELS,
    INCLUDE_CONFIGS,
    PATHS,
    JWT_SECRET,
    COOKIE_SECRET,
    NOTIFY_ON_EXPIRED_TOKEN,
    AES_SECRET
} = require('./constants');

const mc = new MailClient();

const signToken = (token) => jwt.sign(token, JWT_SECRET, { expiresIn: SESSION_EXPIRATION_TIME });

const getTokenFromReqAuthHeader = (req) =>
    req.headers.authorization &&
    typeof req.headers.authorization === 'string' &&
    req.headers.authorization.split(' ')[0] === 'Bearer' &&
    req.headers.authorization.split(' ')[1];

const getUnverifiedTokenFromReq = (req) =>
    req.cookies && req.cookies.get ? req.cookies.get(COOKIE_SECRET, { signed: true }) : getTokenFromReqAuthHeader(req);

const testErrorForInvalidToken = (err) =>
    Boolean(err.constructor.name === 'JsonWebTokenError' && /invalid signature|jwt malformed/i.test(err.message));

/**
 * @param {Express.Request} req incoming request
 * @returns {string} signed token
 */
async function getTokenFromReq(req) {
    const token = getUnverifiedTokenFromReq(req);
    if (!token) return token;
    try {
        const verifiedToken = await jwt.verify(token, JWT_SECRET);
        return verifiedToken;
    } catch (err) {
        if (err.constructor.name === 'TokenExpiredError') {
            if (NOTIFY_ON_EXPIRED_TOKEN) {
                mc.ops('Authentication Error', `Someone is using an expired JWT to access our API.\n\nError Stack: ${err.stack}`);
            }
            return null;
        }
        if (testErrorForInvalidToken(err) && req.cookies && req.cookies.set) {
            req.cookies.set(COOKIE_SECRET); // delete cookie if exists and is invalid
        }
        throw err;
    }
}

/**
 * @param {Express.Request} req incoming request
 * @param {string} signedToken to store
 * @returns {undefined}
 */
function storeSessionWithReq(req, signedToken) {
    if (req.cookies && req.cookies.set) {
        req.cookies.set(COOKIE_SECRET, signedToken, {
            signed: true,
            maxAge: Date.now() + SESSION_EXPIRATION_TIME * 1e3,
            httpOnly: false,
            sameSite: 'None',
            secure: true
        });
    }
}
/**
 * @param {Express.Request} req the incoming, authenticated request
 * @param {Object} token with session keys to refresh
 * @returns {undefined}
 */
function refreshToken(req, token) {
    const refreshedToken = {};
    Object.keys(TOKEN_KEYS).forEach((key) => {
        // refreshedToken[TOKEN_KEYS[key]] = token[TOKEN_KEYS[key]];
        const newtoken = token[TOKEN_KEYS[key]];
        refreshedToken[TOKEN_KEYS[key]] = newtoken;
        console.log(`refreshedToken is: ${refreshedToken}`);
        return refreshToken;
    });
    const signedToken = signToken(refreshedToken);
    storeSessionWithReq(req, signedToken);
    return signedToken;
}

/**
 * Creates a sequelize instance out of a stored JSON from redis
 * @param {string} sessionType model to access
 * @param {number} id id of data to retrieve
 * @returns {SequelizeInstance} constructed instance
 */
async function fetchInstance(sessionType, id) {
    const cachedJSON = await retrieveJSON(`${MODELS[sessionType]}-${id}`);
    const instance = cachedJSON
        ? await models[MODELS[sessionType]].build(cachedJSON, {
              include: INCLUDE_CONFIGS[sessionType](models),
              isNewRecord: false
          })
        : await models[MODELS[sessionType]].findById(id, { include: INCLUDE_CONFIGS[sessionType](models) });
    if (!instance) throw new Error(`Attempted to deserealize non-existent ${sessionType} with id ${id}`);
    await updateInstance(instance);
    return instance;
}

/**
 * @param {Express.Request} req incoming request
 * @returns {string} encrypted token using AES for the emails
 */
function encryptTokenForEmail(req) {
    try {
        const token = getUnverifiedTokenFromReq(req);
        const testSecret = '823rj923jf98239ru2f39#(@**(@*#*(@R3j';

        const secret = process.env.NODE_ENV === 'production' ? AES_SECRET : testSecret;
        const cipher = createCipheriv('aes192', secret, null);

        let result = cipher.update(token, 'utf8', 'hex');
        result += cipher.final('hex');
        return `Encrypted token: ${result}`;
    } catch (err) {
        console.log(err);
        return `Failed to encrypt token. Error: ${err.toString()}`;
    }
}

/**
 * @param {string} sessionType type of session the router will be used for
 * @param {Express.Request} req the request
 * @param {Express.Response} res the response
 * @param {function} next calls next function for the route
 * @returns {function} Express Router middleware
 */
async function processTokenMiddleware(sessionType, req, res, next) {
    const reqHasAuthHeader = getTokenFromReqAuthHeader(req);
    try {
        if (!reqHasAuthHeader) {
            console.log();
            req.cookies = new Cookies(req, res, {
                keys: [Buffer.from(COOKIE_SECRET, 'utf-8')],
                path: PATHS[sessionType],
                overwrite: false,
                sameSite: 'None',
                secure: true,
                httpOnly: false
            });
        }
        const token = await getTokenFromReq(req);
        if (!token) return next();
        if (req.cookies && req.cookies.set) refreshToken(req, token);
        const id = token[TOKEN_KEYS[sessionType]];
        if (!id) return next();
        req[sessionType] = await fetchInstance(sessionType, id);
        return next();
    } catch (err) {
        let opsIncludes = `For authentication strategy for ${sessionType}s.`;
        if (testErrorForInvalidToken(err)) {
            opsIncludes += reqHasAuthHeader ? '\nToken sent using authorization header.\n\n' : '\nToken sent in cookie header.\n\n';
            opsIncludes += encryptTokenForEmail(req);
            opsIncludes += '\n\n';
            opsIncludes += req.url;
            opsIncludes += '\n\n';
            opsIncludes += req.body;
            opsIncludes += '\n\n';
            opsIncludes += req.path;
        }
        console.log('In process token middleware - req has auth header is below');
        console.log(reqHasAuthHeader);
        console.log(req.url);
        console.log(req.body);
        console.log(req.path);
        return handleError({
            opsSubject: 'Authentication Error',
            opsIncludes,
            callback: next
        })(err);
    }
}

module.exports = {
    /**
     * @param {string} sessionType type of session that is logging in
     * @param {Object} passport instance
     * @returns {Express.Router} router with auth middleware
     */
    createRouterWithMiddleware(sessionType, passport) {
        const router = Router();
        router.use(processTokenMiddleware.bind(null, sessionType));
        router.use(passport.initialize({ userProperty: sessionType }));
        return router;
    },

    /**
     * @param {Express.Request} req incoming request
     * @param {string} sessionType type of session that is logging in
     * @param {Object} instance model instance for session
     * @returns {Promise<undefined>} adds sessionType to the token
     */
    async addSessionToToken(req, sessionType, instance) {
        const token = await getTokenFromReq(req);
        const newToken = { [TOKEN_KEYS[sessionType]]: instance.id };
        if (token) {
            Object.keys(TOKEN_KEYS)
                .filter((key) => key !== sessionType)
                .forEach((key) => {
                    const tokenfromReq = token[TOKEN_KEYS[key]];
                    newToken[TOKEN_KEYS[key]] = tokenfromReq;
                    return newToken;
                    // old code was (newToken[TOKEN_KEYS[key]] = token[TOKEN_KEYS[key]]));
                });
        }
        const signedToken = signToken(newToken);
        storeSessionWithReq(req, signedToken);
        return signedToken;
    },

    /**
     * @param {Express.Request} req incoming request
     * @param {string} sessionType type of session that is logging in
     * @returns {Promise<undefined>} removes sessionType from the token
     */
    async removeSessionFromToken(req, sessionType) {
        const token = await getTokenFromReq(req);
        const otherSessions = Object.keys(TOKEN_KEYS).filter((key) => key !== sessionType && token[TOKEN_KEYS[key]]);
        if (otherSessions.length) {
            const newToken = {};
            // otherSessions.forEach((key) => (newToken[TOKEN_KEYS[key]] = token[TOKEN_KEYS[key]]));
            otherSessions.forEach((key) => {
                const tokenfromqeq = token[TOKEN_KEYS[key]];
                newToken[TOKEN_KEYS[key]] = tokenfromqeq;
                return newToken;
            });
            const signedToken = signToken(newToken);
            storeSessionWithReq(req, signedToken);
            return;
        }
        if (req.cookies && req.cookies.set) req.cookies.set(COOKIE_SECRET);
    },

    /**
     * @param {Express.Request} req incoming request that has been authenticated
     * @returns {Promise<string>} newly refreshed signed token
     */
    async refreshSignedToken(req) {
        let token = await getTokenFromReq(req);
        token = refreshToken(req, token);
        storeSessionWithReq(req, token);
        return token;
    }
};
