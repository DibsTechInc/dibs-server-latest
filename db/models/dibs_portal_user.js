
const bcrypt = require('bcrypt');
const shortid = require('shortid');

module.exports = function linkDibsPortalUser(sequelize, DataTypes) {
  /**
   * dibs_portal_user
   * @prop {number} id primary key
   * @prop {string} email prelaunch user email
   * @prop {string} city prelaunch user city
   */
  const DibsPortalUser = sequelize.define('dibs_portal_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobilephone: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.TEXT,
    },
    push_token: {
      type: DataTypes.STRING,
    },
    invite_code_redeemed: {
      type: DataTypes.STRING,
    },
    invite_code_to_refer: {
      type: DataTypes.STRING,
    },
    venmo_name: {
      type: DataTypes.STRING,
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
    },
    stripe_card_id: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    hooks: {
      /**
       * beforeCreate - Description
       * @memberof dibs_user
       * @instance
       * @param {type} user Description
       *
       * @returns {type} Description
       */
      beforeCreate(user) {
        user.email = user.email.toLowerCase();
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
        user.invite_code_to_refer = shortid.generate().toUpperCase().slice(0, 6);
        if (user.mobilephone) {
          user.mobilephone = this.serializePhoneNumber(user.mobilephone);
        }
      },
    },
  });

  /**
   * serializePhoneNumber - Description
   * @memberof dibs_portal_user
   * @static
   * @param {type} phoneNum Description
   *
   * @returns {type} Description
   */
  DibsPortalUser.serializePhoneNumber = function serializePhoneNumber(phoneNum) {
    let newPhoneNum = phoneNum;
    if (newPhoneNum != null) {
      newPhoneNum = newPhoneNum.replace(/\D/g, '');
    }
    if (newPhoneNum.length < 10 || newPhoneNum.length > 12) {
      newPhoneNum = null;
    }
    return newPhoneNum;
  };

  DibsPortalUser.associate = function associate(models) {
    models.dibs_portal_user.hasMany(models.credit, {
      foreignKey: 'dibs_portal_userid',
    });
    models.dibs_portal_user.hasMany(models.flash_credit, {
      foreignKey: 'dibs_portal_userid',
    });
  };

  /**
   * validatePassword - Description
   * @memberof dibs_user
   * @instance
   * @param {type} password Description
   *
   * @returns {type} Description
   */
  DibsPortalUser.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  /**
   * clientJSON - Description
   * @memberof dibs_user
   * @instance
   * @returns {object} Sanitized user object
   * @swagger
   *  definitions:
   *    serializedUser:
   *      type: object
   *      properties:
   *        id:
   *          type: integer
   *        email:
   *          type: string
   *        firstName:
   *          type: string
   *        lastName:
   *          type: string
   *        mobilephone:
   *          type: string
   *        inviteCode:
   *          type: string
   *        venmoName:
   *          type: string
   *
   */
  DibsPortalUser.prototype.clientJSON = function clientJSON() {
    return {
      email: this.email,
      id: this.id,
      firstName: this.first_name,
      lastName: this.last_name,
      mobilephone: this.mobilephone,
      inviteCode: this.invite_code_to_refer,
      venmoName: this.venmo_name,
      credits: this.credits,
      flash_credits: this.flash_credits || [],
      pushToken: this.push_token,
    };
  };

  return DibsPortalUser;
};
