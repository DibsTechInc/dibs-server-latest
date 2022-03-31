const { PURCHASE_PLACES } = require('../constants');

module.exports = async function createNewSubscriptionTransaction({
  autopaySubscription,
  taxAmount = 0,
  price = 0,
  purchasePlace = PURCHASE_PLACES.SUBSCRIPTION,
  save = false,
  description = null,
  subcriptionInvoiceId = null,
  discount_amount,
  } = {}) {
  let instance = this.build({
    userid: autopaySubscription.user.id,
    source: autopaySubscription.studio_package.studio.source,
    studioid: autopaySubscription.studio_package.studio.studioid,
    dibs_studio_id: autopaySubscription.studio_package.dibs_studio_id,
    type: this.Types.PACKAGE,
    studio_package_id: autopaySubscription.studio_package.id,
    amount: 0,
    tax_amount: taxAmount,
    status: 0,
    original_price: price,
    purchasePlace,
    description,
    discount_amount,
    stripe_invoice_id: subcriptionInvoiceId,
  });
  instance.calculateAmount();
  if (!save) return instance;
  instance = await instance.save();
  return instance;
};
