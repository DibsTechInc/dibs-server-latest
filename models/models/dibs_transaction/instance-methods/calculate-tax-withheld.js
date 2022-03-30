const Decimal = require('decimal.js');

module.exports = function calculateTaxWithheld(taxRate, { save = false, transaction = null } = {}) {
  if (isNaN(taxRate)) throw new Error('You must use a numeric value for models.dibs_transaciton.calculateWithheld');
  const taxWithheldCoeff = Decimal(1).minus(
    Decimal(1).dividedBy(Decimal(1).plus(+taxRate))
  );
  this.tax_withheld = +Decimal(this.chargeAmount).times(taxWithheldCoeff).toDP(2);
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
