const Decimal = require('decimal.js');
const { PURCHASE_PLACES } = require('../constants');

module.exports = function calculateDibsFee(studio, { save = false, transaction = null } = {}) {
  const feeRate = this.purchasePlace === PURCHASE_PLACES.USER_ADMIN ? studio.admin_fee_rate : studio.widget_fee_rate;
  this.dibs_fee = +Decimal(this.chargeAmount).minus(this.tax_withheld)
    .times(feeRate)
    .toDP(2);
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
