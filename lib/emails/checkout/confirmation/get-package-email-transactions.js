const { format: formatCurrency } = require('currency-formatter');
const moment = require('moment-timezone');
const getFormatFromCountry = require('../../../../lib/helpers/get-date-format-from-country');

/**
 * @param {Object} studio the purchase was for
 * @param {Array<Object>} packTransactions dibs_transaction instances for packs
 * @returns {Array<Object>} pack transaction data mapped to an email
 */
module.exports = function getPackageEmailTransactions(studio, packTransactions) {
  return packTransactions.map((t) => {
    const betterFormatCurrency = val => formatCurrency(val, { code: studio.currency, precision: 2 });
    return {
      promo: (t.promoCode ? {
        promoApplied: true,
        name: t.promoCode.code,
        promoAmount: betterFormatCurrency(t.discount_amount),
      } : null),
      taxes: (t.tax_amount ? {
        taxesApplied: true,
        taxAmount: betterFormatCurrency(t.tax_amount),
      } : null),
      credits: (t.creditsSpent ? {
        creditApplied: Boolean(t.creditsSpent),
        creditAmount: betterFormatCurrency(t.creditsSpent),
      } : null),
      packagePrice: betterFormatCurrency(t.original_price),
      amount: betterFormatCurrency(t.amount),
      studioPackage: t.studioPackage,
      date: moment.tz(studio.mainTZ).format(getFormatFromCountry(studio.country)).toString(),
      pass: t.pass,
      transaction: t.dataValues,
      renewDate: ((t.pass && t.pass.expiresAt) ?
        moment(t.pass.expiresAt).tz(studio.mainTZ).format(studio.currency === 'GBP' ?
          'MMMM Do YYYY' : getFormatFromCountry(studio.country)).toString()
        : `${t.studioPackage.passesValidFor} ${t.studioPackage.validForInterval}`),
    };
  });
};
