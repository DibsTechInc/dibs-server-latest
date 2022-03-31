const Decimal = require('decimal.js');

module.exports = function calculateAmount({ save = false, transaction = null } = {}) {
  this.amount = +Decimal(this.original_price).plus(this.tax_amount).minus(this.discount_amount);
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
