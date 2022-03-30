const Decimal = require('decimal.js');
const { PURCHASE_PLACES } = require('../constants');

module.exports = function calculateDibsFeeForSubscription(studio, { save = false, transaction = null } = {}) {
  if (this.purchasePlace !== PURCHASE_PLACES.SUBSCRIPTION) throw new Error('Not a subscription transaction');
  const widgetFee = +studio.widget_fee_rate;
  const taxRate = Decimal(studio.locations[0].tax_rate).dividedBy(100).toNumber();
  const applicationFee = (Decimal(1).minus((Decimal(1).minus(widgetFee)).dividedBy(Decimal(1).plus(taxRate)))).toDecimalPlaces(4);
  this.dibs_fee = +Decimal(this.chargeAmount)
    .times(applicationFee)
    .minus(this.tax_withheld)
    .toDP(2);
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
