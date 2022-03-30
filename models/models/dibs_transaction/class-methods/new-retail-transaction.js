const { PURCHASE_PLACES } = require('../constants');
const Decimal = require('decimal.js');

module.exports = async function newRetailTransaction({
  user,
  studio,
  product,
  description = 'Beginning purchase of retail item',
  purchasePlace = PURCHASE_PLACES.STUDIO_ADMIN,
  save = false,
  location = { retail_tax_rate: 0 },
  promoCode = null,
  employeeid,
} = {}) {
  let instance = this.build({
    userid: user.id,
    source: studio.source,
    studioid: studio.studioid,
    dibs_studio_id: studio.id,
    type: this.Types.RETAIL,
    dibs_fee: 0,
    status: 0,
    original_price: product.price,
    purchasePlace,
    description,
    discount_amount: (promoCode && promoCode.getDiscountAmount(product.price)) || 0,
    promoid: promoCode ? promoCode.id : null,
    employeeid: employeeid || null,
    retail_product_id: product.id,
  });
  instance.calculateTaxAmount(+Decimal(product.taxable ? location.retail_tax_rate : 0).dividedBy(100));

  instance.calculateAmount();
  if (!save) return instance;
  instance = await instance.save();
  return instance;
};
