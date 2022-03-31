module.exports = function linkDibsPortalTransaction(sequelize, DataTypes) {
  /**
   * dibs_portal_transaction
   * @prop {number} id primary key
   */
  const DibsPortalTransaction = sequelize.define('dibs_portal_transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_portal_userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    },
    dibs_brand_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_brands',
        key: 'id',
      },
    },
    description: DataTypes.TEXT,
    eventid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    flash_credit_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'flash_credits',
        key: 'id',
      },
    },
    stripe_charge_id: DataTypes.STRING,
    stripe_refund_id: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    tax_amount: DataTypes.FLOAT,
    stripe_fee: DataTypes.FLOAT,
    dibs_fee: DataTypes.FLOAT,
    brand_payment: DataTypes.FLOAT,
    void: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  DibsPortalTransaction.associate = function associate(models) {
    models.dibs_portal_transaction.belongsTo(models.event, { foreignKey: 'eventid', targetKey: 'eventid', as: 'event' });
    models.dibs_portal_transaction.belongsTo(models.dibs_portal_user, { foreignKey: 'dibs_portal_userid', as: 'user' });
    models.dibs_portal_transaction.belongsTo(models.dibs_brand, { foreignKey: 'dibs_brand_id', as: 'dibs_brand' });
    models.dibs_portal_transaction.belongsTo(models.flash_credit, { foreignKey: 'flash_credit_id', as: 'flash_credit' });
  };

  return DibsPortalTransaction;
};
