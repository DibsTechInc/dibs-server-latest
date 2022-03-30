module.exports = function linkPasswordReset(sequelize, DataTypes) {
  /**
   * password_reset
   *
   * @class password_reset
   * @prop {string} uuidParam the uuidParam
   * @prop {number} userID the userID
   */
  const PasswordReset = sequelize.define('password_reset', {
    uuidParam: {
      type: DataTypes.UUID,
    },
    userID: {
      type: DataTypes.INTEGER,
    },
    shortCode: {
      type: DataTypes.INTEGER,
    },
    shortCodeVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    paranoid: true,
    getterMethods: {
      stringifiedShortCode() {
        if (!this.shortCode) return null;
        let str = String(this.shortCode);
        while (str.length < 6) str = `0${str}`;
        return str;
      },
    },
  });

  PasswordReset.prototype.generateShortCode = function generateShortCode({ save = false } = {}) {
    this.shortCode = Math.round(1e6 * Math.random());
    return save ? this.save() : this;
  };

  return PasswordReset;
};
