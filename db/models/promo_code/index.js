const ClassMethods = require('./class-methods');
const InstanceMethods = require('./instance-methods');

module.exports = function linkPromoCode(sequelize, DataTypes) {
  const promoCodeTypes = {
    CASH_OFF: 'CASH_OFF',
    FREE_CLASS: 'FREE_CLASS',
    PERCENT_OFF: 'PERCENT_OFF',
    GIFT_CARD: 'GIFT_CARD',
    ADD_CREDITS: 'ADD_CREDITS',
    FIXED_PRICE: 'FIXED_PRICE',
  };
  const promoCodeProducts = {
    UNIVERSAL: 'UNIVERSAL',
    CLASS: 'CLASS',
    PACKAGE: 'PACKAGE',
    RETAIL: 'RETAIL',
  };
  /**
   * promo_code
   *
   * @class promo_code
   * @prop {number} id the id
   * @prop {number} amount the amount
   * @prop {string} code the code
   * @prop {string} type the type
   * @prop {DateTime} expiration the expiry date
   * @prop {boolean} unique whether it is unique
   * @prop {number} [studioid=0] the studio id, 0 is dibs
   * @prop {string} source the source
   * @prop {number} code_usage_limit the code use limit
   * @prop {number} [user_usage_limit=1] the user user limit
   * @prop {number} employeeid
   * @prop {boolean} front_desk_visible
   * @prop {DateTime} createdAt a date
   * @prop {DateTime} updatedAt a date
   * @prop {DateTime} deletedAt a date
   */
  const PromoCode = sequelize.define('promo_code', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.keys(promoCodeTypes).map(key => promoCodeTypes[key]),
    },
    expiration: {
      type: DataTypes.DATE,
    },
    unique: {
      type: DataTypes.BOOLEAN,
    },
    studioid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    source: {
      type: DataTypes.STRING(4),
      defaultValue: 'dibs',
    },
    code_usage_limit: {
      type: DataTypes.INTEGER,
    },
    user_usage_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    first_time_dibs: DataTypes.BOOLEAN,
    first_time_studio_dibs: DataTypes.BOOLEAN,
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    product: {
      type: DataTypes.ENUM,
      values: Object.keys(promoCodeProducts).map(key => promoCodeProducts[key]),
    },
    grouped_code: DataTypes.BOOLEAN,
    used_as_group: DataTypes.VIRTUAL,
    studios: DataTypes.ARRAY(DataTypes.INTEGER),
    locations: DataTypes.ARRAY(DataTypes.INTEGER),
    employeeid: DataTypes.INTEGER,
    front_desk_visible: DataTypes.BOOLEAN,
    refundable: DataTypes.BOOLEAN,
    class_name_pattern: DataTypes.STRING,
    group_id: {
      type: DataTypes.INTEGER,
      defaultValue: process.env.NODE_ENV !== 'test' ? sequelize.literal('DEFAULT') : undefined
    },
    stripe_coupon_id: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    paranoid: true,
    hooks: {
      /**
       * Upper cases the code
       * @memberof promo_code
       * @instance
       * @param {string} promo the promo code
       * @returns {undefined}
       */
      beforeCreate(promo) {
        promo.code = promo.code.toUpperCase(); // eslint-disable-line no-param-reassign
      },
    },
  });
  PromoCode.Types = promoCodeTypes;
  PromoCode.Products = promoCodeProducts;
  ClassMethods.forEach(method => PromoCode[method.name] = method);
  InstanceMethods.forEach(method => PromoCode.prototype[method.name] = method);

  return PromoCode;
};
