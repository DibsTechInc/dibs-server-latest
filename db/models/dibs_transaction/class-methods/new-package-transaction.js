const Decimal = require('decimal.js');

module.exports = async function createNewPackageTransaction({
  user,
  studioPackage,
  price = 0,
  promoCode = null,
  purchasePlace = null,
  save = false,
  description = null,
  checkoutUUID = null,
  employeeid,
  } = {}) {
  let discountAmount = Decimal(0);
  if (promoCode) discountAmount = discountAmount.plus(promoCode.getDiscountAmount(price));
  let instance = this.build({
    userid: user.id,
    source: studioPackage.studio.source,
    studioid: studioPackage.studio.studioid,
    dibs_studio_id: studioPackage.dibs_studio_id,
    type: this.Types.PACKAGE,
    amount: 0,
    tax_amount: 0,
    status: 0,
    original_price: Number(price),
    purchasePlace,
    description,
    promoid: promoCode ? promoCode.id : null,
    discount_amount: Number(discountAmount),
    employeeid,
    checkoutUUID,
    studio_package_id: studioPackage.id,
  });
  instance.calculateTaxAmount(+Decimal(+studioPackage.studio.locations[0].tax_rate).dividedBy(100));
  instance.calculateAmount();
  if (!save) return instance;
  instance = await instance.save();
  return instance;
};
