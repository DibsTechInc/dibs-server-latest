const purchaseErrorLib = require('../../../errors/purchasing');
const Promise = require('bluebird');

/**
 * @param {Object} cart user is checking out
 * @returns {Object} cart where gift card items have a dibs_transaction built
 */
module.exports = async function buildGiftCardTransactions({
  user,
  cart,
  employeeid,
  purchasePlace,
  checkoutUUID,
}) {
  if (!cart.giftCards.length) return cart;
  const studio = await models.dibs_studio.findById(cart.giftCards[0].dibsStudioId);
  if (!studio) throw new purchaseErrorLib.CartError('A gift card item has an invalid dibs_studio_id.');
  return {
    ...cart,
    giftCards: await Promise.map(cart.giftCards, async item => ({
      ...item,
      dibsTransaction: await models.dibs_transaction.newGiftCardTransaction({
        user,
        studio,
        amount: item.amount,
        description: `Starting a purchase for a gift card for ${item.amount} in credit at studio ${item.dibsStudioId}.`,
        employeeid,
        purchasePlace,
        checkoutUUID,
        save: true,
      }),
    })),
  };
};
