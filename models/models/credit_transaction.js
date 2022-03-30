const CREDIT_TRANSACTION_TYPES = {
  SMART_PASS_AWARD: 'smart_pass_award',
  CLASS_DROP: 'class_drop',
  CREDIT_LOAD: 'credit_load',
  REFER_A_FRIEND: 'refer_a_friend',
  COMP: 'comp',
  CREDIT_APPLICATION: 'credit_application',
  REFUND: 'refund',
  PROMO_CODE: 'promo_code',
};

module.exports = function linkCreditTransaction(sequelize, DataTypes) {
  const CreditTransaction = sequelize.define('credit_transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    creditid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'credits',
        key: 'id',
      },
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    },
    credit_tier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'credit_tiers',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(CREDIT_TRANSACTION_TYPES),
      allowNull: true,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
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
    promoid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'promo_codes',
        key: 'id',
      },
    },
    before_credit: DataTypes.FLOAT,
    after_credit: DataTypes.FLOAT,
    createdAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    updatedAt: false,
  });

  CreditTransaction.Types = CREDIT_TRANSACTION_TYPES;

  CreditTransaction.associate = function associate(models) {
    CreditTransaction.belongsTo(models.credit, {
      foreignKey: 'creditid',
      as: 'credit',
    });
    CreditTransaction.belongsTo(models.dibs_transaction, {
      foreignKey: 'transaction_id',
      as: 'transaction',
    });
    CreditTransaction.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      as: 'studio',
    });
    CreditTransaction.belongsTo(models.dibs_user, {
      foreignKey: 'userid',
      as: 'user',
    });
  };
  return CreditTransaction;
};
