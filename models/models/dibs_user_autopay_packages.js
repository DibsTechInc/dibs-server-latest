const moment = require('moment');

module.exports = function linkDibsEffects(sequelize, DataTypes) {
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  const AutopayPackage = sequelize.define('dibs_user_autopay_packages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    studio_package_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'studio_packages',
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
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    stripe_subscription_id: DataTypes.STRING,
    stripe_customer_id: DataTypes.STRING,
    cancel_notified_at: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
  });
  AutopayPackage.associate = function associate(models) {
    models.dibs_user_autopay_packages.belongsTo(models.studio_packages, {
      as: 'studio_package',
      key: 'id',
      foreignKey: 'studio_package_id',
    });
    models.dibs_user_autopay_packages.belongsTo(models.dibs_user, {
      as: 'user',
      key: 'id',
      foreignKey: 'userid',
    });
  };

  AutopayPackage.prototype.shouldPassRenew = function shouldPassRenew() {
    if (!this.studio_package) throw new Error('You must query with associated package to use this method');
    return this.cancel_notified_at ? moment(this.cancel_notified_at)
      .diff(moment().subtract(this.studio_package.notification_period, this.studio_package.autopayIncrement),this.studio_package.autopayIncrement, true)
    > 1 : true;
  }
  
  return AutopayPackage;
};
