/**
 * @param {Object} args named arguments object
 * @param {Object} args.user making the purchase
 * @param {Object} args.cart current cart at the studio package is for
 * @param {number} args.employeeid of employee acting on behalf of the user
 * @param {string} args.purchasePlace where purchase was made
 * @param {string} args.checkoutUUID unique id of checkout
 * @returns {Object} cart with package transactions
 */
module.exports = async function buildCreditDibsTransactions({ user, cart, employeeid, purchasePlace, checkoutUUID }) {
  if (!cart.credits.length) return cart;
  return {
    ...cart,
    credits: await Promise.map(cart.credits, async item => ({
      ...item,
      dibsTransaction: await models.dibs_transaction.newCreditTransaction({
        creditTier: item.creditTier,
        user,
        employeeid,
        purchasePlace,
        checkoutUUID,
        save: true,
      }),
    })),
  };
};
