const Decimal = require('decimal.js');

module.exports = async function createNewClassTransaction({
  user,
  event,
  price = 0,
  pass = null,
  flashCredit = null,
  promoCode = null,
  purchasePlace = null,
  save = false,
  checkoutUUID = null,
  description = null,
  employeeid,
  unpaid = false,
} = {}) {
  let discountAmount = Decimal(0);
  if (flashCredit) discountAmount = discountAmount.plus(flashCredit.credit);
  if (promoCode) discountAmount = discountAmount.plus(promoCode.getDiscountAmount(price));
  let instance = this.build({
    userid: user.id,
    eventid: event.eventid,
    source: event.source,
    studioid: event.studioid,
    dibs_studio_id: event.dibs_studio_id,
    event_price: event.price,
    type: this.Types.CLASS,
    amount: 0,
    tax_amount: 0,
    status: 0,
    original_price: price,
    with_passid: pass ? pass.id : null,
    purchasePlace,
    description,
    flash_credit_id: flashCredit && flashCredit.id,
    promoid: promoCode && promoCode.id,
    discount_amount: Number(discountAmount),
    checkoutUUID,
    employeeid: employeeid || null,
    unpaid,
  });
  if (!pass && !unpaid) {
    instance.calculateTaxAmount(+Decimal(+event.location.tax_rate).dividedBy(100));
    instance.calculateAmount();
  }
  if (!save) return instance;
  instance = await instance.save();
  return instance;
};
