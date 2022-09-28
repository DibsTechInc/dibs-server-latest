const purchaseErrorTypes = require('../../../errors/purchasing/types');

const CART_ITEM_KEYS = [
  'credits',
  'events',
  'packages',
  'giftCards',
];

/**
 * @param {Object} cart to test if it is valid for checkout
 * @returns {boolean} true if the cart is valid
 */
function isValidCart(cart) {
  return Boolean(
    cart
    && CART_ITEM_KEYS.some(key => cart[key]) // check if any of the item types is in the cart
    && CART_ITEM_KEYS.every(key => (!cart[key] || Array.isArray(cart[key]))) // check if any item in the cart is not an array
    && CART_ITEM_KEYS.some(key => (cart[key] && cart[key].length)) // check if there is at least non-empty item type
  );
}

module.exports = {
  isValidCart,
  /**
   * @param {Object} cart to test for validation
   * @returns {Object} cart with each item type set as empty array or array in request
   */
  validateCart(cart) {
    if (!isValidCart(cart)) {
      throw new purchaseErrorTypes.CartError('Invalid cart in request');
    }
    const newCart = {};
    // Just easier to not have to deal with handling the falsey case each time
    CART_ITEM_KEYS.forEach(key => (newCart[key] = cart[key] || []));
    return newCart;
  },
};
