const stripeErrorLib = require('../../../errors/stripe');
const StripeClient = require('../../../stripe/client');
const Decimal = require('decimal.js');
const Promise = require('bluebird');
const {
  checkEventItemForCharge,
  checkPackItemForCharge,
  checkGiftCardItemForCharge,
} = require('./helpers');

const sc = new StripeClient();

/**
 * @param {Object} charge stripe charge object
 * @param {Object} refund stripe refund object
 * @param {Object} item cart item
 * @returns {Object} cart item with refund recorded (if needed)
 */
async function recordStripeChargeAndRefund(charge, refund, item) {
  await item.dibsTransaction.setStripeChargeId(charge.id, { save: true });
  await item.dibsTransaction.setStripeRefundId(refund.id, { save: true });
  return item;
}

/**
 * @param {Object} user who needs refund
 * @param {Object} cart the user failed to check out
 * @param {Object} charge stripe charge object
 * @returns {Object} refunded cart
 */
module.exports = async function refundCart(user, cart, charge) {
  const studio = cart.events.length ? cart.events[0].event.studio : cart.packages[0].studioPackage.studio;
  try {
    const itemsToRefund = [
      ...cart.credits,
      ...cart.packages.filter(checkPackItemForCharge),
      ...cart.events.filter(checkEventItemForCharge),
      ...cart.giftCards.filter(checkGiftCardItemForCharge),
    ];
    const amount = itemsToRefund.reduce(
      (acc, item) => acc.plus(item.dibsTransaction.chargeAmount),
      Decimal(0)
    ).toNumber();
    const refund = await sc.refund(charge.id, {
      amount,
      stripeAccountId: studio.stripe_account_id,
    });
    await Promise.map(itemsToRefund, recordStripeChargeAndRefund.bind(null, charge, refund));
  } catch (err) {
    stripeErrorLib.handleStripeError({
      source: stripeErrorLib.StripeErrorSources.Checkout,
      user,
      cart,
      err: new stripeErrorLib.StripeRefundError(err, { chargeId: charge.id }),
      studio,
    });
  }
};
