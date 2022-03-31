module.exports = function createPseudoClientServices(sequelize, DataTypes) {
  return sequelize.define('pseudo_client_services', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    source: DataTypes.STRING(4),
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: DataTypes.DATE,
  });
};
