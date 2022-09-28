/**
 * @param {Object} cart being checked out
 * @returns {Array<Objects>} items in cart as an array
 */
module.exports = function getCartItems(cart) {
  return [
    ...cart.credits,
    ...cart.packages,
    ...cart.events,
    ...cart.giftCards,
  ];
};
