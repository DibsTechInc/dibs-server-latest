const Decimal = require('decimal.js');

module.exports = function calculateTaxAmount(taxRate, { save = false, transaction = null } = {}) {
  if (isNaN(taxRate)) throw new Error('You must use a numeric value for models.dibs_transaciton.calculateTaxAmount');
  this.tax_amount = +Decimal(this.original_price).minus(this.discount_amount).times(+taxRate).toDP(2);
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
