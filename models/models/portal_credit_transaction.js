module.exports = function linkPortalCreditTransaction(sequelize, DataTypes) {
  const PortalCreditTransaction = sequelize.define('portal_credit_transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    },
    creditid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'credits',
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
    before_credit: DataTypes.FLOAT,
    after_credit: DataTypes.FLOAT,
    flash_credit_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'flash_credits',
        key: 'id',
      },
    },
    referred_by_userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    },
    referral_redeemed_userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    },
    type: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    updatedAt: false,
  });

  PortalCreditTransaction.associate = function associate(models) {
    PortalCreditTransaction.belongsTo(models.credit, {
      foreignKey: 'creditid',
      as: 'credit',
    });
    PortalCreditTransaction.belongsTo(models.dibs_brand, {
      foreignKey: 'dibs_brand_id',
      as: 'studio',
    });
    PortalCreditTransaction.belongsTo(models.dibs_portal_user, {
      foreignKey: 'userid',
      as: 'user',
    });
  };
  return PortalCreditTransaction;
};
