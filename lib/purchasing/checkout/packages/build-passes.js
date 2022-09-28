const Decimal = require('decimal.js');

/**
 * @param {Object} user making the purchase
 * @param {Object} cart user is checking out at that studio
 * @returns {Object} cart with built pass instances (not saved)
 */
module.exports = function buildPassesInCart(user, cart) {
  if (!cart.packages.length) return cart;
  return {
    ...cart,
    packages: cart.packages.map(item => ({
      ...item,
      // pass: item.studioPackage.private ? null : models.passes.createNewPass({
      pass: models.passes.createNewPass({
        user,
        studioPackage: item.studioPackage,
        studio: item.studioPackage.studio,
        purchaseTransactionId: null,
        amountPaid: +Decimal(item.dibsTransaction.original_price).minus(item.dibsTransaction.discount_amount),
        autopay: (item.autopay || item.studioPackage.autopay === models.studio_packages.AUTOPAY_OPTS.FORCE),
        userAutopayPackageId: null,
      }),
    })),
  };
};
