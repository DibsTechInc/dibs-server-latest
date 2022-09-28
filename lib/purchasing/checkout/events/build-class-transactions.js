/**
 * @param {Object} args named arguments object
 * @param {Object} args.user making the purchase
 * @param {Object} args.cart current cart at the studio package is for
 * @param {number} args.employeeid of employee acting on behalf of the user
 * @param {string} args.purchasePlace where purchase was made
 * @param {string} args.checkoutUUID unique id of checkout
 * @returns {Object} cart with class transactions
 */
module.exports = async function buildClassTransactions({ user, cart, purchasePlace, checkoutUUID, employeeid }) {
  if (!cart.events.length) return cart;
  return {
    ...cart,
    events: await Promise.map(cart.events, async item => ({
      ...item,
      dibsTransaction: await models.dibs_transaction.newClassTransaction({
        ...item,
        checkoutUUID,
        user,
        purchasePlace,
        save: true,
        description: `Start cart purchase for studio ${item.event.dibs_studio_id} eventid: ${item.eventid}`,
        employeeid,
      }),
    })),
  };
};
