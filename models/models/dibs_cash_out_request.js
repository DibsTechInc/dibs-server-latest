module.exports = function linkDibsCashOutRequest(sequelize, DataTypes) {
  /**
   * dibs_cash_out_request
   * @prop {number} id primary key
   */
  const DibsCashOutRequest = sequelize.define('dibs_cash_out_request', {
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
    amount_paid: DataTypes.FLOAT,
    amount_removed_from_account: DataTypes.FLOAT,
    pending: DataTypes.BOOLEAN,
    paid: DataTypes.BOOLEAN,
    rejected: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT,
    date_processed: DataTypes.DATE,
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

  DibsCashOutRequest.associate = function associate(models) {
    models.dibs_cash_out_request.belongsTo(models.dibs_portal_user, { foreignKey: 'dibs_portal_userid', as: 'user' });
    models.dibs_cash_out_request.belongsTo(models.dibs_brand, { foreignKey: 'dibs_brand_id', as: 'dibs_brand' });
  };

  return DibsCashOutRequest;
};
