module.exports = function linkGetDibsRequests(sequelize, DataTypes) {
  /**
   * flash_credit
   *
   * @class get_dibs_requests
   */
  return sequelize.define('get_dibs_requests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studioName: {
      type: DataTypes.STRING,
    },
    studioWebsite: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    bookingPlatform: {
      type: DataTypes.STRING,
    },
    otherPlatform: {
      type: DataTypes.STRING,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    termsAndConditions: {
      type: DataTypes.BOOLEAN,
    },
    timezone: {
      type: DataTypes.STRING,
    },
  }, {

  });
};
