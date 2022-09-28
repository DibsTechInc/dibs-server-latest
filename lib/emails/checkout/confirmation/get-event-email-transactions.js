const { format: formatCurrency } = require('currency-formatter');
const Decimal = require('decimal.js');
const moment = require('moment-timezone');

/**
 * @param {Object} studio the purchase was for
 * @param {Array<Object>} eventTransactions dibs_transaction instances for events
 * @returns {Array<Object>} event transaction data mapped to an email
 */
module.exports = function getEventEmailTransactions(studio, eventTransactions) {
  return eventTransactions.map((t) => {
    const flashCreditAmount = t.flashCredit ? t.flashCredit.credit : 0;
    const betterFormatCurrency = val => formatCurrency(val, { code: studio.currency, precision: 2 });
    const earnedCredit = t.pass && !t.pass.unlimited ? Math.max(0, Decimal(t.pass.passValue).minus(t.original_price)) : 0;
    const zoomlinkvalue = t.event.manual_track_id || null;
    let zoomlinkpresent = false;
    if ( zoomlinkvalue) {
      if (zoomlinkvalue.length > 3) {
        zoomlinkpresent = true;
      }
    }
    
    return {
      class: {
        name: t.event.name,
        location: t.event.location.name,
        instructor: `${t.event.instructor.first_name} ${t.event.instructor.last_name}`,
        date: (studio.country === 'US' ?
          moment(t.event.start_date).format('M/D/YYYY')
          : moment(t.event.start_date).format('D/M/YYYY')),
        day: moment(t.event.start_date).format('dddd').toString(),
        time: (studio.country === 'US' ?
          moment(t.event.start_time).format('h:mm A')
          : moment(t.event.start_time).format('H:mm')),
        classPrice: betterFormatCurrency(t.amount),
        originalPrice: betterFormatCurrency(t.original_price),
        // zoomlink: (t.event.dibs_studio_id === 212 ? t.event.manual_track_id : null),
        zoomlink: (zoomlinkpresent ? zoomlinkvalue : null),
      },
      passes: (t.pass ? ({
        passApplied: true,
        ...t.pass.dataValues,
        usesRemaining: t.pass.studioPackage.unlimited ?
          null : +Decimal(t.pass.totalUses).minus(t.pass.usesCount),
        unlimited: t.pass.studioPackage.unlimited,
        hasEarnedCredit: Boolean(earnedCredit),
        earnedCredit: betterFormatCurrency(earnedCredit),
      }) : null),
      promo: (t.promoCode ? {
        promoApplied: true,
        name: t.promoCode.code,
        promoAmount: betterFormatCurrency(+Decimal(t.discount_amount).minus(flashCreditAmount)),
      } : null),
      credits: (t.creditsSpent ? {
        creditApplied: true,
        creditAmount: betterFormatCurrency(t.creditsSpent),
      } : null),
      flashCredits: (t.flashCredit ? {
        flashCreditAmount: betterFormatCurrency(flashCreditAmount),
        flashCreditApplied: true,
      } : null),
      taxes: (t.tax_amount ? {
        taxesApplied: true,
        taxAmount: betterFormatCurrency(t.tax_amount),
      } : null),
    };
  });
};
