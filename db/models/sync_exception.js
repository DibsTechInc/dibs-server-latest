module.exports = function SyncExceptionsModel(sequelize, DataTypes) {
  return sequelize.define('sync_exception', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studioid: DataTypes.INTEGER,
    source: DataTypes.STRING(4),
    pattern: DataTypes.STRING,
    instructorid: DataTypes.INTEGER,
    classid: DataTypes.INTEGER,
    locationid: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });

  AS
};
