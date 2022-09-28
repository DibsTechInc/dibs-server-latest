/**
 * @param {Array<Object>} checkoutResult, each element is the return value of handleStudioCart
 * @returns {Object} cart transactions formatted for response sorted by item type
 */
module.exports = function getTransactionsFromCheckoutResult(checkoutResult) {
  return checkoutResult.reduce((acc, studioCheckout) => {
    if (!studioCheckout.success) return acc;
    const { cart: studioCart } = studioCheckout;
    studioCart.events.forEach((item) => {
      acc.events.push({
        ...item.dibsTransaction.dataValues,
        chargeAmount: item.dibsTransaction.chargeAmount,
        event: item.event.dataValues,
      });
    });
    studioCart.packages.forEach((item) => {
      acc.packages.push({
        ...item.dibsTransaction.dataValues,
        chargeAmount: item.dibsTransaction.chargeAmount,
        studioPackage: item.studioPackage.dataValues,
      });
    });
    studioCart.credits.forEach((item) => {
      acc.credits.push({
        ...item.dibsTransaction.dataValues,
        chargeAmount: item.dibsTransaction.chargeAmount,
        creditTier: {
          ...item.creditTier.dataValues,
          receiveAmount: item.creditTier.receiveAmount,
        },
      });
    });
    studioCart.giftCards.forEach((item) => {
      acc.giftCards.push({
        ...item.dibsTransaction.dataValues,
        chargeAmount: item.dibsTransaction.chargeAmount,
        giftCard: item.giftCard.dataValues,
      });
    });
    return acc;
  }, { events: [], packages: [], credits: [], giftCards: [] });
};
