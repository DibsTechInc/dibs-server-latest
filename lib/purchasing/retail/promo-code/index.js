const { PromoCodeApplicationError } = require('../../../errors/purchasing/types');

module.exports = {
  /**
   * @param {object} studio  studio instance
   * @param {string} code  promo code to lookup
   * @param {object} user user instance
   * @returns {number} amount to discount
   */
  handle: async function retailPromoCode(studio, code, user) {
    try {
      if (!code) return 0;
      const { success, promoCode, message } = await models.promo_code.verifyPromoCode(code, user, {
        product: models.promo_code.Products.RETAIL,
        studioid: studio.studioid,
        source: studio.source,
      });
      if (!success) throw new PromoCodeApplicationError(message);
      return promoCode;
    } catch (err) {
      throw new PromoCodeApplicationError(err);
    }
  },
};
