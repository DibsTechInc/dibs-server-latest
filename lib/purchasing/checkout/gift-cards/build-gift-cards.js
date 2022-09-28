/**
 * @param {Object} user purchasing the gift card
 * @param {Object} cart being checked out
 * @param {Object} sqlTransaction for atomic update
 * @returns {Object} new cart with gift card instances
 */
module.exports = async function buildGiftCards(user, cart, sqlTransaction) {
  if (!cart.giftCards.length) return cart;
  return {
    ...cart,
    giftCards: await Promise.map(cart.giftCards, async (item) => {
      const giftCard = await models.dibs_gift_card.createInstanceAndPromoCode({
        senderid: user.id,
        recipientEmail: item.recipientEmail,
        dibsTransaction: item.dibsTransaction,
        sqlTransaction,
      });
      return {
        ...item,
        giftCard,
        dibsTransaction: await item.dibsTransaction.setGiftCardId(giftCard.id, {
          save: true,
          transaction: sqlTransaction,
        }),
      };
    }),
  };
};
