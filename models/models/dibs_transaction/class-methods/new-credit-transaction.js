module.exports = async function createNewCreditTransaction({
  user,
  creditTier,
  purchasePlace = null,
  save = false,
  description = null,
  checkoutUUID = null,
  employeeid,
}) {
  let instance = this.build({
    userid: user.id,
    credit_tier_id: creditTier.id,
    source: creditTier.studio.source,
    studioid: creditTier.studio.studioid,
    dibs_studio_id: creditTier.dibs_studio_id,
    type: this.Types.CREDIT,
    amount: Number(creditTier.payAmount),
    tax_amount: 0,
    status: 0,
    original_price: Number(creditTier.payAmount),
    purchasePlace,
    description,
    discount_amount: 0,
    employeeid,
    checkoutUUID,
  });
  if (!save) return instance;
  instance = await instance.save();
  return instance;
};
