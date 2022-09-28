/**
 * @param {Object} args named arguments object
 * @param {Object} args.user making the purchase
 * @param {Object} args.cart current cart at the studio package is for
 * @param {number} args.employeeid of employee acting on behalf of the user
 * @param {string} args.purchasePlace where purchase was made
 * @param {string} args.checkoutUUID unique id of checkout
 * @returns {Object} cart with package transactions
 */
module.exports = async function buildPackageTransactions({ user, cart, employeeid, purchasePlace, checkoutUUID }) {
  if (!cart.packages.length) return cart;
  return {
    ...cart,
    packages: await Promise.map(cart.packages, async item => ({
      ...item,
      dibsTransaction: await models.dibs_transaction.newPackageTransaction({
        promoCode: item.promoCode || null,
        user,
        studioPackage: item.studioPackage,
        purchasePlace,
        autopay: item.autopay,
        employeeid,
        price: item.price,
        description: `Starting purchase for studio package ${item.studioPackage.id}.${item.autopay ? ' Autopayment selected' : ''}`,
        checkoutUUID,
        save: true,
      }),
    })),
  };
};
