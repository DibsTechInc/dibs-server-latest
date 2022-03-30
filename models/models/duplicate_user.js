module.exports = function linkDuplicateUser(sequelize, DataTypes) {
  /**
   * duplicate_user
   * @prop {number} id primary key
   * @prop {string} clientid source client id
   * @prop {number} userid relates to existing dibs_user
   * @prop {number} dibs_studio_id relates to studio
   */
  return sequelize.define('duplicate_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientid: {
      type: DataTypes.STRING,
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
    },
    dibs_user_studio_id: {
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});
};
