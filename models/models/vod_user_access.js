module.exports = function linkVODUserAccess(sequelize, DataTypes) {
    /**
     * vod_user_access
     * @prop {number} id primary key
     * @prop {number} videoid of the video
     * @prop {number} userid where available
    */
  const vodUserAccess = sequelize.define('vod_user_access', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    videoid: {
      type: DataTypes.INTEGER,
    },
    url: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    freezeTableName: true,
  });
  return vodUserAccess;
};
