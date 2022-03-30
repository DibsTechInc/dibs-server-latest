/**
 * @param {number} giftCardId id of gift card transaction is for
 * @param {boolean} save if true, saves to database
 * @param {Object} transaction SQL transaction
 * @returns {Object|Promise<Object>} updated instance
 */
module.exports = function setGiftCardId(giftCardId, {
  save = false,
  transaction,
}) {
  this.gift_card_id = giftCardId;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
