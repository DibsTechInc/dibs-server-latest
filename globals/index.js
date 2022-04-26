const moment = require('moment-timezone');
const models = require('../models/sequelize');
const jwt = require('jsonwebtoken');

global.apiSuccessWrapper = require('./apiSuccessWrapper');
global.apiFailureWrapper = require('./apiFailureWrapper');

// global.apiAuthentication = function apiAuthentication(req, res, next) {
//   console.log(passport)
//   passport.authenticate('bearer', { session: false }, (err, user) => {
//     if (err) return next(err);
//     if (!user) return res.status(403).json(apiFailureWrapper({}, 'Invalid token'));
//     return next();
//   });
// };

// Make sequelize model global so we do not have to keep instantiating it
global.sequelize = models.sequelize;
global.Sequelize = models.Sequelize;
global.models = models;

const {
    Sequelize: { Op }
} = global.models;

global.isAuthenticated = function isAuthenticated(req, res, next) {
    if (
        req.user &&
        !req.user.constructor.name === 'dibs_api_user' &&
        (!req.user.lastAccessedAt || moment(req.user.lastAccessedAt).isBefore(moment().subtract(10, 'minutes')))
    ) {
        return models.dibs_user.update({ lastAccessedAt: new Date() }, { where: { id: req.user.id } }).then(() => next());
    }
    if (req.user && req.user.constructor.name !== 'dibs_api_user') {
        return next();
    }

    res.json(
        global.apiFailureWrapper(
            {},
            "I'm getting an error. If this problem persists, try using a different browser (e.g. Chrome/Safari). Error code: 7A472"
        )
    );
    return null;
};

global.isStudioAuthenticated = function isStudioAuthenticated(req, res, next) {
    if (req.employee && req.employee.studioid) return next();

    res.json(
        global.apiFailureWrapper(
            {},
            "I'm getting an error. If this problem persists, try using a different browser (e.g. Chrome/Safari). Error code: 7A473"
        )
    );
    return null;
};

global.isStudioAdmin = function isStudioAdmin(req, res, next) {
    if (req.employee && req.employee.studioid && req.employee.admin) {
        return next();
    }
    if (req.employee && req.employee.studioid) {
        return res.json(global.apiFailureWrapper({}, 'You do not have permission for this feature.'));
    }
    if (req.employee) {
        return res.json(global.apiFailureWrapper({}, 'You are not currently logged into your admin account, please refresh the page.'));
    }
    return res.json(global.apiFailureWrapper({}, 'You are not currently logged in. Please refresh the page'));
};
