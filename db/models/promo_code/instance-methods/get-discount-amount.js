const Decimal = require('decimal.js');

module.exports = function getDiscountAmount(currentPrice) {
  return Decimal(currentPrice).minus(this.applyDiscount(currentPrice, this.type, this.amount)).toNumber();
};
