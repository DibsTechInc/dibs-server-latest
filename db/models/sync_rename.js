module.exports = function SyncExceptionsModel(sequelize, DataTypes) {
  return sequelize.define('sync_rename', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studioid: DataTypes.INTEGER,
    source: DataTypes.STRING(4),
    pattern: DataTypes.STRING,
    new_name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
};
