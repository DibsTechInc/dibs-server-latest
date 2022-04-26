const { Passport } = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { employeeIncludeConfig } = require('./include-config');

/**
 * @param {Object} models sequelize models
 * @returns {function} authentication callback for when an employee logs in
 */
function createStudioEmployeeLoginMethod(models) {
    return function loginStudioEmployee(email, password, done) {
        process.nextTick(async () => {
            try {
                const employee = await models.studio_employee.findOne({
                    where: { email: { $iLike: email } },
                    include: employeeIncludeConfig(models)
                });
                if (!employee) return done(null, false);
                if (!employee.validatePassword(password)) return done(null, false);
                return done(null, employee);
            } catch (err) {
                return done(err, null);
            }
        });
    };
}

/**
 * @param {Object} models sequelize models
 * @returns {Passport} configured passport instance for dibs_user
 */
module.exports = function configureEmployeePassport(models) {
    const passport = new Passport();

    passport.serializeUser((employee, done) => {
        try {
            if (!employee) {
                return done(null, false);
            }
            return done(null, { id: employee.id });
        } catch (err) {
            return done(err, null);
        }
    });
    passport.deserializeUser(async (instance, done) => {
        try {
            const employee = await models.studio_employee.findById(instance.id, {
                include: employeeIncludeConfig(models)
            });
            if (employee) return done(null, employee);
            return done(null, false);
        } catch (err) {
            return done(err, null);
        }
    });

    passport.use(
        'studio-admin-login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            createStudioEmployeeLoginMethod(models)
        )
    );

    return passport;
};
