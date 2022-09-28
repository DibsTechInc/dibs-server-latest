const { format: formatCurrency } = require('currency-formatter');

/**
 * @param {Object} studio the purchase was for
 * @param {Array<Object>} creditTransactions dibs_transaction instances for credit
 * @returns {Array<Object>} credit transaction data mapped to an email
 */
module.exports = function getCreditEmailTransactions(studio, creditTransactions) {
  return creditTransactions.map((t) => {
    const betterFormatCurrency = val => formatCurrency(val, { code: studio.currency, precision: 2 });
    return {
      payAmount: betterFormatCurrency(t.amount),
      receiveAmount: betterFormatCurrency(t.creditTier.receiveAmount),
    };
  });
};
