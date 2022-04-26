// const user = require('./user');
// const dibsAdmin = require('./dibs-admin');
const employee = require('./employee');
// const apiUser = require('./api-user');
const models = require('../../models/sequelize');
const jwtLib = require('../../lib/jwt');

const passports = {
    //   user,
    //   dibsAdmin,
    employee,
    //   apiUser,
    routers: {}
};

Object.keys(passports).forEach((key) => {
    if (key === 'routers') return;
    passports[key] = passports[key](models);
    passports.routers[key] = () => jwtLib.createRouterWithMiddleware(key, passports[key]);
});

module.exports = passports;
