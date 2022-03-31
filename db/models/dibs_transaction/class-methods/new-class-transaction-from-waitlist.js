const Decimal = require('decimal.js');

module.exports = async function newClassTransactionFromWaitlist(waitlistTransaction, { save = false } = {}) {
  let instance = this.build({
    userid: waitlistTransaction.userid,
    eventid: waitlistTransaction.eventid,
    source: waitlistTransaction.source,
    studioid: waitlistTransaction.studioid,
    dibs_studio_id: waitlistTransaction.dibs_studio_id,
    type: this.Types.CLASS,
    discount_amount: 0,
    status: 0,
    original_price: waitlistTransaction.original_price,
    with_passid: waitlistTransaction.with_passid,
    purchasePlace: waitlistTransaction.purchasePlace,
    description: 'User enrolled in the class off of the waitlist',
    employeeid: waitlistTransaction.employeeid,
  });
  if (!waitlistTransaction.with_passid) {
    instance.calculateTaxAmount(+Decimal(+waitlistTransaction.event.location.tax_rate).dividedBy(100));
    instance.calculateAmount();
  } else {
    instance.tax_amount = 0;
    instance.amount = 0;
  }
  if (!save) return instance;
  instance = await instance.save();
  return instance;
};
