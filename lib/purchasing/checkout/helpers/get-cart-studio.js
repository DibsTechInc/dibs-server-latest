/**
 *
 * @param {Object} cart being checked out (by studio)
 * @returns {Object} studio purchase is for
 */
module.exports = function getCartStudio(cart) {
  return (
    (cart.events[0] && cart.events[0].event)
    || (cart.packages[0] && cart.packages[0].studioPackage)
    || (cart.credits[0] && cart.credits[0].creditTier)
    || cart.giftCards[0]
  ).studio;
};
