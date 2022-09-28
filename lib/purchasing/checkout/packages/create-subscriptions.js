const Promise = require('bluebird');
const stripeLib = require('../stripe');

/**
 * @param {Object} user checking out
 * @param {Object} cart they are purchasing
 * @param {Array<string>} subscription ids created by Stripe
 * @returns {Object} contains cart and a boolean indicating if a user needs to be unsubscribed should later code error
 */
module.exports = async function createSubscriptions({
  user,
  cart,
  sqlTransaction,
}) {
  const subscriptionIds = [];
  let needsUnsubscribe = false;
  cart = {
    ...cart,
    packages: await Promise.map(cart.packages, async (item) => {
      if (
        (item.autopay || item.studioPackage.autopay === models.studio_packages.AUTOPAY_OPTS.FORCE)
        && item.studioPackage.autopay !== models.studio_packages.AUTOPAY_OPTS.NONE
      ) {
        const {
          success,
          err,
          autopayPackage,
        } = await stripeLib.subscribeUserToPlan({
          user,
          studioPackage: item.studioPackage,
          promoCode: item.promoCode || {},
          sqlTransaction,
        });
        if (!success) throw err;
        needsUnsubscribe = true;
        subscriptionIds.push(autopayPackage.stripe_subscription_id);
        item.pass.dibs_autopay_id = autopayPackage.id;
      }
      item.pass = item.pass && await item.pass.save({ transaction: sqlTransaction });
      item.dibsTransaction.for_passid = item.pass && item.pass.id;
      item.dibsTransaction.save({ transaction: sqlTransaction });
      return item;
    }),
  };
  return {
    cart,
    needsUnsubscribe,
    subscriptionIds,
  };
};
