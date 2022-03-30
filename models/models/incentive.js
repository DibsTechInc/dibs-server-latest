module.exports = function linkIncentive(sequelize, DataTypes) {
  /**
   * incentive
   *
   * @class incentive
   * @prop {string} email
   * @prop {string} invite_code
   * @prop {number} studioid
   * @prop {number} credit
   * @prop {datetime} expiration
   * @prop {string} source
   */
  return sequelize.define('incentive', {
    email: {
      type: DataTypes.STRING,
    },
    invite_code: {
      type: DataTypes.TEXT,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    credit: {
      type: DataTypes.INTEGER,
    },
    expiration: {
      type: DataTypes.DATE,
    },
    source: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true,
  });
};
