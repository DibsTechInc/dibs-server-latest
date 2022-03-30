module.exports = function linkSCT(sequelize, DataTypes) {
  return sequelize.define('studio_credit_special_tiers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source: {
      type: DataTypes.STRING,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    payAmount: {
      type: DataTypes.INTEGER,
    },
    receiveAmount: {
      type: DataTypes.INTEGER,
    },
    usesPerUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalUses: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    expireAt: DataTypes.DATE,
    updatedAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  });
};
