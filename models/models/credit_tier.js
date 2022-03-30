const Decimal = require('decimal.js');

module.exports = function linkCreditTier(sequelize, DataTypes) {
  const CreditTier = sequelize.define('credit_tier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    payAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    loadBonus: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    getterMethods: {
      receiveAmount() {
        return +Decimal(this.payAmount).plus(this.loadBonus);
      },
    },
  });

  CreditTier.associate = function associate(models) {
    CreditTier.belongsTo(models.dibs_studio, { as: 'studio', foreignKey: 'dibs_studio_id' });
  };

  return CreditTier;
};
