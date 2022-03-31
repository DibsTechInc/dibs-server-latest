module.exports = function linkUserStudioRequeests(sequelize, DataTypes) {
  /**
   * user_studio_requests
   * @class studio_pricing
   * @prop {number} id the id
   * @prop {string} studioName the studio name
   * @prop {string} visitorEmail the email of the user who requested the studio
   */
  return sequelize.define('user_studio_requests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studioName: {
      type: DataTypes.STRING,
    },
    visitorEmail: {
      type: DataTypes.TEXT,
    },
  }, {
  });
};
