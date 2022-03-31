module.exports = function linkDibsPrelaunchUser(sequelize, DataTypes) {
  /**
   * dibs_prelaunch_user
   * @prop {number} id primary key
   * @prop {string} email prelaunch user email
   * @prop {string} city prelaunch user city
   */
  return sequelize.define('dibs_prelaunch_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
};
