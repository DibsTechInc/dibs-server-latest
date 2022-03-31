const { apiFailureWrapper } = require('../../../lib/helpers/api-wrappers');
const errorHelper = require('@dibs-tech/dibs-error-handler');

/**
 * @param {Number} currentPrice  current value being discounted
 * @param {String} code promo code to find and apply
 * @param {Object} user instance of the user model
 * @param {Number} eventid optional eventid parameter (needed for class application)
 * @param {Object} options  options object
 * @param {Number=0} options.studioid external studio identifier
 * @param {String='dibs'} options.source source of studio
 * @param {Enum=CLASS} options.product product type to apply
 */
module.exports = async function findAndApplyDiscount(currentPrice, code, user, eventid, options = { studioid: 0, source: 'dibs', product: this.Products.CLASS }) {
  try {
    options = typeof eventid === 'object' ? eventid : options;
    eventid = typeof eventid === 'object' ? undefined : eventid;
    const result = await this.verifyPromoCode(code, user, {
      ...options,
      eventids: eventid ? [eventid] : [],
    });
    if (result.success) {
      result.modifiedChargeAmount = this.promoChargeCalculator(currentPrice, result.promoCode.type, result.promoCode.amount);
    }
    return result;
  } catch (err) {
    errorHelper.handleError({
      opsSubject: 'Promo Code Find And Apply Error',
      opsIncludes: `Error retriving a promo code for code: ${code}, user: ${user.id}`,
    });
    return apiFailureWrapper(err, 'Oops. Something went wrong. Please re-attempt or call 646.760.3427.');
  }
};
