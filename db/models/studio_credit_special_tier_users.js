module.exports = function linkSCTU(sequelize, DataTypes) {
  return sequelize.define('studio_credit_special_tier_users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studio_credit_special_tiers_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'studio_credit_special_tiers',
        key: 'id',
      },
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  });
};
