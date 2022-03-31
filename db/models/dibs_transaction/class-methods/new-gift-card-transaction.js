/**
 * @param {Object} user who is purchasing the gift card
 * @param {Object} studio the gift card is for
 * @param {number} amount that they are giving
 * @param {string} purchasePlace of gift card
 * @param {string} description of transaction
 * @param {string} checkoutUUID unique id of checkout
 * @param {number} employeeid of employee making purchase on user's behalf (can be null)
 * @param {boolean} save if true, saves the new transaction to the db
 * @param {Object} transaction SQL transaction
 * @returns {Promise<Object>} new dibs_transaction instance
 */
module.exports = async function createNewGiftCardTransaction({
  user,
  studio,
  amount,
  purchasePlace,
  description,
  checkoutUUID,
  employeeid,
  save = false,
  transaction,
}) {
  let instance = this.build({
    userid: user.id,
    dibs_studio_id: studio.id,
    studioid: studio.studioid,
    source: studio.source,
    amount: Number(amount),
    tax_amount: 0,
    status: 0,
    discount_amount: 0,
    original_price: Number(amount),
    purchasePlace,
    description,
    checkoutUUID,
    employeeid: employeeid || null,
    type: this.Types.GIFT_CARD,
  });
  if (!save) return instance;
  instance = await instance.save(
    transaction ? { transaction } : undefined);
  return instance;
};
