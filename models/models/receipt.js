module.exports = function linkReceipt(sequelize, DataTypes) {
  /**
   * receipts
   * @prop {number} id primary key
   * @prop {string} email prelaunch user email
   * @prop {string} city prelaunch user city
   */
  const Receipt = sequelize.define('receipt', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_brand_id: {
      type: DataTypes.INTEGER,
    },
    dibs_portal_userid: {
      type: DataTypes.INTEGER,
    },
    flash_credit_id: {
      type: DataTypes.INTEGER,
    },
    credit_transaction_id: {
      type: DataTypes.INTEGER,
    },
    receipt_amount: {
      type: DataTypes.FLOAT,
    },
    receipt_date: {
      type: DataTypes.DATE,
    },
    receipt_notes: {
      type: DataTypes.TEXT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  Receipt.associate = function associate(models) {
    models.receipt.belongsTo(models.dibs_portal_user, { as: 'portalUser', foreignKey: 'dibs_portal_userid' });
    models.receipt.belongsTo(models.dibs_brand, { as: 'brand', foreignKey: 'dibs_brand_id' });
    models.receipt.belongsTo(models.flash_credit, { foreignKey: 'flash_credit_id', as: 'flashCredit' });
    models.receipt.belongsTo(models.credit_transaction, { foreignKey: 'credit_transaction_id', as: 'creditTransaction' });
  };

  return Receipt;
};
