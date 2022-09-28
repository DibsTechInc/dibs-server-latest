const { format: formatCurrency } = require('currency-formatter');

module.exports = function getGiftCardEmailTransactions(studio, giftCardTransactions) {
  return giftCardTransactions.map((t) => {
    const betterFormatCurrency = val => formatCurrency(val, { code: studio.currency, precision: 2 });
    return {
      amount: betterFormatCurrency(t.amount),
      credits: (t.creditsSpent ? {
        creditApplied: true,
        creditAmount: betterFormatCurrency(t.creditsSpent),
      } : null),
    };
  });
};
