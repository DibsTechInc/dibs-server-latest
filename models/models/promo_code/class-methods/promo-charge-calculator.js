const Decimal = require('decimal.js');
/**
 * [promoChargeCalculator description]
 * @param  {number} currentPrice current price of the class
 * @param  {string} type         type of promo code
 * @param  {number} promoAmount  amount the promo code will modify the price of class by
 * @return {number}              Modified price after applying promo code
 */
function promoChargeCalculator(currentPrice, type, promoAmount) {
  let modifiedChargeAmount;
  let percentageOff;
  switch (type) {
    // cash off promo
    case this.Types.CASH_OFF:
      modifiedChargeAmount = new Decimal(currentPrice).minus(promoAmount).toNumber();
      if (modifiedChargeAmount <= 0) return 0;
      return modifiedChargeAmount;
    // percentage off promo
    case this.Types.PERCENT_OFF:
      percentageOff = new Decimal(1).minus(new Decimal(promoAmount).dividedBy(100));
      return new Decimal(currentPrice).times(percentageOff).toDP(2).toNumber();
    // free class promo
    case this.Types.FREE_CLASS:
      return 0;
    case this.Types.FIXED_PRICE:
      return promoAmount;
    default:
      return currentPrice;
  }
}

module.exports = promoChargeCalculator;
