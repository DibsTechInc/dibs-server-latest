const bcrypt = require('bcrypt');

module.exports = function dibsAdmin(sequelize, DataTypes) {
  const DibsAdmin = sequelize.define('dibs_admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    picture_url: {
      type: DataTypes.STRING,
      defaultValue: '//d1f9yoxjfza91b.cloudfront.net/dibs-user-placeholder.png',
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: DataTypes.DATE,
  }, {
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
        if (user.changed('password')) {
          // eslint-disable-next-line no-param-reassign
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
        }
      },
    },
    getterMethods: {
      /**
       * Gets the fullname
       * @memberof studio_employee
       * @instance
       * @returns {string} employee's full name
       */
      name() {
        return `${this.firstname} ${this.lastname}`;
      },
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
          this.firstname = fullnameArr[0];
          this.lastname = '';
        } else {
          this.lastname = fullnameArr.pop();
          this.firstname = fullnameArr.join(' ');
        }
      },
    },
  });
  /**
     * generateHash generates a password hash
     * @memberof studio_employee
     * @static
     * @param {string} password the user submitted password
     *
     * @returns {string} the salted password
  */
  DibsAdmin.generateHash = function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  /**
      * validatePassword - Description
      * @memberof studio_employee
      * @instance
      * @param {string} password the password
      *
      * @returns {boolean} whether the password is valid
      */
  DibsAdmin.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  /**
   * clientJSON - Description
   * @memberof studio_employee
   * @instance
   * @returns {object} the json for the clientside
   */
  DibsAdmin.prototype.clientJSON = function clientJSON() {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      name: this.name,
      profile_picture: this.picture_url,
    };
  };

  return DibsAdmin;
};
