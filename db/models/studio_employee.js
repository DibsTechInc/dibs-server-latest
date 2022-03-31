/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const { updateInstance } = require('../../lib/dibs-redis-interface');

module.exports = function linkStudioEmployee(sequelize, DataTypes) {
    /**
     * studio_employee
     *
     * @class studio_employee
     * @prop {number} id the id
     * @prop {string} firstName the firstname
     * @prop {string} lastName the lastname
     * @prop {string} email the email
     * @prop {string} password the password
     * @prop {string} source the source
     * @prop {number} studioid the studio id
     * @prop {boolean} admin whether the user is an admin
     * @prop {boolean} instructor whether the user account should be restricted
     * @prop {string} phone the employee's phone number
     */
    const StudioEmployee = sequelize.define(
        'studio_employee',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            firstName: {
                type: DataTypes.STRING
            },
            lastName: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.TEXT
            },
            password: {
                type: DataTypes.TEXT
            },
            source: {
                type: DataTypes.STRING(4)
            },
            studioid: {
                type: DataTypes.INTEGER
            },
            admin: {
                type: DataTypes.BOOLEAN
            },
            instructor_only: {
                type: DataTypes.BOOLEAN
            },
            profile_picture: {
                type: DataTypes.STRING,
                defaultValue: '//d1f9yoxjfza91b.cloudfront.net/dibs-user-placeholder.png'
            },
            dibs_studio_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'dibs_studios',
                    as: 'studio'
                }
            },
            last_login: {
                type: DataTypes.DATE
            },
            phone: {
                type: DataTypes.STRING
            },
            demo_account: {
                type: DataTypes.BOOLEAN
            },
            test_account: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        },
        {
            hooks: {
                /**
                 * salts the user password
                 * @memberof studio_employee
                 * @instance
                 * @param {object} user the user
                 * @returns {undefined}
                 */
                beforeCreate(user) {
                    // eslint-disable-next-line no-param-reassign
                    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
                },
                beforeUpdate(user) {
                    /* eslint-disable no-param-reassign */
                    if (user.changed('password')) {
                        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
                    }
                    if (user.phone) {
                        user.phone = this.serializePhoneNumber(user.phone);
                    }
                },
                async afterFind(employee) {
                    await updateInstance(employee);
                },
                async afterCreate(employee) {
                    await updateInstance(employee);
                },
                async afterUpdate(employee) {
                    await updateInstance(employee);
                },
                async afterSave(employee) {
                    await updateInstance(employee);
                }
            } /* eslint-enable no-param-reassign */,
            getterMethods: {
                /**
                 * Gets the fullname
                 * @memberof studio_employee
                 * @instance
                 * @returns {string} employee's full name
                 */
                name() {
                    return `${this.firstName} ${this.lastName}`;
                }
            },
            setterMethods: {
                /**
                 * Sets the First and Last names based on the fullname
                 * @memberof studio_employee
                 * @instance
                 * @param {string} fullname the employes's fullname
                 *
                 * @returns {undefined}
                 */
                name(fullname) {
                    const fullnameArr = fullname.split(' ');
                    if (fullnameArr.length === 1) {
                        this.firstName = fullnameArr[0];
                        this.lastName = '';
                    } else {
                        this.lastName = fullnameArr.pop();
                        this.firstName = fullnameArr.join(' ');
                    }
                }
            },
            paranoid: true
        }
    );

    StudioEmployee.createNewEmployee = async function createStudioEmployee({
        firstName,
        lastName,
        email,
        password,
        dibs_studio_id: studioId,
        admin = false,
        instructor_only = false
    }) {
        if (!email) throw new Error('Please provide an email');
        if (!password) throw new Error('Please provide a password');
        if (Number.isNaN(studioId) || studioId % 1) throw new Error('Please provide a Dibs studio id (integer)');
        const studio = await this.sequelize.models.dibs_studio.findById(+studioId);
        if (!studio) throw new Error('No such studio');
        const instance = await StudioEmployee.create({
            firstName,
            lastName,
            email,
            password,
            source: studio.source,
            studioid: studio.studioid,
            dibs_studio_id: studioId,
            admin,
            instructor_only,
            demo_account: false
        });
        return instance;
    };

    /**
     * generateHash generates a password hash
     * @memberof studio_employee
     * @static
     * @param {string} password the user submitted password
     *
     * @returns {string} the salted password
     */
    StudioEmployee.generateHash = function generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    /**
     * serializePhoneNumber - Description
     * @memberof dibs_user
     * @static
     * @param {type} phoneNum Description
     *
     * @returns {type} Description
     */
    StudioEmployee.serializePhoneNumber = function serializePhoneNumber(phoneNum) {
        let newPhoneNum = phoneNum;
        if (newPhoneNum != null) {
            newPhoneNum = newPhoneNum.replace(/\D/g, '');
        }
        if (newPhoneNum.length < 10 || newPhoneNum.length > 12) {
            newPhoneNum = null;
        }
        return newPhoneNum;
    };

    StudioEmployee.associate = function associate(models) {
        models.studio_employee.belongsTo(models.dibs_studio, { foreignKey: 'dibs_studio_id', as: 'studio' });
    };

    /**
     * validatePassword - Description
     * @memberof studio_employee
     * @instance
     * @param {string} password the password
     *
     * @returns {boolean} whether the password is valid
     */
    StudioEmployee.prototype.validatePassword = function validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
    };

    /**
     * clientJSON - Description
     * @memberof studio_employee
     * @instance
     * @returns {object} the json for the clientside
     */
    StudioEmployee.prototype.clientJSON = function clientJSON() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            name: this.name,
            studioid: this.studioid,
            source: this.source,
            admin: this.admin,
            instructor_only: this.instructor_only,
            studio: this.studio,
            profile_picture: this.profile_picture,
            demo_account: this.demo_account,
            phone: this.phone
        };
    };

    /**
     * recordLogin
     * @memberof studio_employee
     * @instance
     * @returns {Promise} database update
     */
    StudioEmployee.prototype.recordLogin = function recordLogin() {
        return this.update({ last_login: new Date() });
    };

    return StudioEmployee;
};
