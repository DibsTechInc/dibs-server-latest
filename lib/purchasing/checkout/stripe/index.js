const sharedStripeLib = require('../../shared/stripe');
const stripeErrorLib = require('../../../errors/stripe');

/* eslint-disable global-require */
module.exports = {
  captureChargeForCart: require('./capture-charge'),
  preChargeForCart: require('./pre-charge'),
  refundCart: require('./refund-cart'),

  /**
   * @param {Array<any>} args arguments for sharedStripeLib.subscribeUserToPlan
   * @returns {Object} returns object with autopay pack if successful, otherwise returns error thrown
   */
  async subscribeUserToPlan(...args) {
    try {
      const autopayPackage = await sharedStripeLib.subscribeUserToPlan(...args);
      return { success: true, autopayPackage };
    } catch (err) {
      return { success: false, err: new stripeErrorLib.StripeSubscriptionError(err) };
    }
  },
};
