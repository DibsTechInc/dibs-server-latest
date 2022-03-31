const Decimal = require('decimal.js');

module.exports = function linkPackages(sequelize, DataTypes) {
  const { Op } = DataTypes;
  const AUTOPAY_OPTS = {
    NONE: 'NONE',
    FORCE: 'FORCE',
    ALLOW: 'ALLOW',
  };
  const AUTOPAY_INCREMENTS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
  };
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  const StudioPackage = sequelize.define('studio_packages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    name: DataTypes.STRING,
    classAmount: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    autopay: {
      type: DataTypes.ENUM,
      values: Object.keys(AUTOPAY_OPTS).map(k => AUTOPAY_OPTS[k]),
      defaultValue: AUTOPAY_OPTS.ALLOW,
    },
    priceAutopay: DataTypes.FLOAT,
    autopayIncrement: {
      type: DataTypes.ENUM,
      values: Object.keys(AUTOPAY_INCREMENTS).map(k => AUTOPAY_INCREMENTS[k]),
      defaultValue: AUTOPAY_INCREMENTS.MONTH,
    },
    autopayIncrementCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    stripe_plan_id: DataTypes.STRING,
    terms_and_conditions: DataTypes.STRING,
    onlyFirstPurchase: DataTypes.BOOLEAN,
    passesValidFor: DataTypes.INTEGER,
    validForInterval: {
      type: DataTypes.ENUM,
      values: Object.keys(AUTOPAY_INCREMENTS).map(k => AUTOPAY_INCREMENTS[k]),
      defaultValue: AUTOPAY_INCREMENTS.MONTH,
    },
    available: DataTypes.BOOLEAN,
    unlimited: DataTypes.BOOLEAN,
    sortIndex: DataTypes.INTEGER,
    dailyUsageLimit: DataTypes.INTEGER,
    packagePurchaseLimit: {
      type: DataTypes.INTEGER,
    },
    customDescription: DataTypes.STRING,
    front_desk_only: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    vod_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: DataTypes.DATE,
    should_display_name: DataTypes.BOOLEAN,
    on_demand_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expires_after_first_booking: DataTypes.BOOLEAN,
    source_id: DataTypes.STRING,
    notification_period: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commitment_period: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      min: 0,
    },
    member_class_fixed_price: DataTypes.FLOAT,
    zf_series_type_id: DataTypes.STRING,
  }, {
    paranoid: true,
    getterMethods: {
      normalizedName() {
        return this.name || (this.unlimited ? 'Unlimited' : `${this.classAmount} Classes`);
      },
    },
  });
  StudioPackage.AUTOPAY_OPTS = AUTOPAY_OPTS;
  StudioPackage.AUTOPAY_INCREMENTS = AUTOPAY_INCREMENTS;
  StudioPackage.associate = function associate(models) {
    models.studio_packages.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      targetKey: 'id',
      as: 'studio',
    });
    models.studio_packages.hasMany(models.passes, {
      foreignKey: 'studio_package_id',
      as: 'passes',
    });
    models.studio_packages.hasMany(models.studio_package_discount, {
      foreignKey: 'studio_package_id',
      as: 'discounts',
    });
    models.studio_packages.hasMany(models.dibs_user_autopay_packages, {
      foreignKey: 'studio_package_id',
      as: 'memberships',
    });
  };

  // TODO refactor pass validation to use user model method then delete this one
  // cannot delete it now w/o breaking dibs-server
  StudioPackage.prototype.isValidOnlyFirstPurchase = async function isValidOnlyFirstPurchase(user) {
    return !(await user.hasMadePurchaseAtStudio(this.dibs_studio_id));
  };

  StudioPackage.prototype.isValidWithPurchaseLimit = async function isValidWithPurchaseLimit(user, { quantity = 1 } = {}) {
    const attendees = await models.attendees.findAll({
      where: {
        email: { [Op.iLike]: user.email },
        dibs_studio_id: this.studio.id,
        [Op.not]: {
          serviceName: {
            [Op.or]: [
              { [Op.iLike]: '%classpass%' },
              { [Op.iLike]: '%gilt%' },
              { [Op.iLike]: '%fitreserve%' },
            ],
          },
        },
      },
    });
    const previousMatchingPassesCount = await models.passes.count({
      where: {
        userid: user.id,
        studio_package_id: this.id,
      },
    });
    const specificPackagePurchases = attendees.filter(attendee => attendee.serviceName.toLowerCase() === this.name.toLowerCase());
    return (previousMatchingPassesCount + specificPackagePurchases.length + quantity) <= this.packagePurchaseLimit;
  };

  /**
  * Retrieves current price include any potential promotions
  * @returns {Number} current price of the package
  */
  StudioPackage.prototype.getCurrentPrice = async function getCurrentPrice({ autopay = false }) {
    const isAutopay = (
      (autopay && this.autopay === models.studio_packages.AUTOPAY_OPTS.ALLOW && !this.onlyFirstPurchase)
      || this.autopay === models.studio_packages.AUTOPAY_OPTS.FORCE
    );
    const [discount] = await this.getDiscounts({
      where: {
        promotion_start: { [Op.lte]: new Date() },
        promotion_end: { [Op.gte]: new Date() },
      },
      limit: 1,
      order: [['createdAt']],
    });
    return isAutopay ? ((discount && discount.discount_price_autopay) || this.priceAutopay) : ((discount && discount.discount_price) || this.price);
  };

  return StudioPackage;
};
