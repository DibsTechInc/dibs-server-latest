const Decimal = require('decimal.js');

module.exports = function calculateStudioPayment({ save = false, transaction = null } = {}) {
  this.studio_payment = +Decimal(this.chargeAmount).minus(this.dibs_fee).minus(this.stripe_fee).minus(this.tax_withheld);
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
