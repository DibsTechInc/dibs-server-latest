module.exports = function linkCreditPromoCode(sequelize, DataTypes) {
  /**
   * credit_promo_code
   *
   * @prop {number} id primary key
   * @prop {string} source studio source
   * @prop {number} studioid credit applies to
   * @prop {Date} expires_on expiration date of the credit
   * @prop {string} promotion code
   * @prop {number} amount_needed for credit to be applied
   * @prop {number} amount_awarded from credit
   * @prop {number} user_usage_limit number of times per customer creidt can be used
   * @prop {bool} bonus_applies indicates if 10% bonus on purchases over $50 still applies
   * @prop {string} description of promotion
   */
  return sequelize.define('credit_promo_code', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source: DataTypes.STRING(4),
    studioid: DataTypes.INTEGER,
    expires_on: DataTypes.DATE,
    code: DataTypes.STRING,
    amount_needed: DataTypes.FLOAT,
    amount_awarded: DataTypes.FLOAT,
    user_usage_limit: DataTypes.INTEGER,
    bonus_applies: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
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
};
