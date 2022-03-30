module.exports = function applyDiscount(currentPrice) {
  return this.constructor.promoChargeCalculator(currentPrice, this.type, this.amount);
};
