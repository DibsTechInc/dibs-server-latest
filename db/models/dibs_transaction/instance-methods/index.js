const applyCredit = require('./apply-credit');

/* eslint-disable global-require */
module.exports = {
  amendDescription: require('./amend-description'),
  applyCredit,
  applyStudioCredit(...args) {
    return applyCredit.call(this, 'studio', ...args);
  },
  applyRafCredit(...args) {
    return applyCredit.call(this, 'raf', ...args);
  },
  assignSaleId: require('./assign-saleid'),
  calculateAmount: require('./calculate-amount'),
  calculateDibsFee: require('./calculate-dibs-fee'),
  calculateDibsFeeForSubscription: require('./calculate-dibs-fee-for-subscription'),
  calculateStudioPayment: require('./calculate-studio-payment'),
  calculateTaxAmount: require('./calculate-tax-amount'),
  calculateTaxWithheld: require('./calculate-tax-withheld'),
  setMinChargeAdjustment: require('./set-min-charge-adjustment'),
  setStripeChargeId: require('./set-stripe-charge-id'),
  setStripeFee: require('./set-stripe-fee'),
  setStripeRefundId: require('./set-stripe-refund-id'),
  setWaitlistId: require('./set-waitlist-id'),
  setGiftCardId: require('./set-gift-card-id'),
  success: require('./success'),
  assignSpot: require('./assign-spot'),
};
