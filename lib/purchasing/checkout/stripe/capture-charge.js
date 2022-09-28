const StripeClient = require('../../../stripe/client');
const Decimal = require('decimal.js');
const { StripeCaptureChargeError } = require('../../../errors/stripe');
const MailClient = require('@dibs-tech/mail-client');
const {
  checkEventItemForCharge,
  checkPackItemForCharge,
  checkGiftCardItemForCharge,
} = require('./helpers');
const cartHelpers = require('../helpers');

const sc = new StripeClient();
const mc = new MailClient();

module.exports = async function captureCartCharge({
  cart,
  charge,
  studio,
}) {
  try {
    const amount = +Decimal(charge.amount).dividedBy(100);
    const completeCharge = await sc.completeCharge({
      chargeId: charge.id,
      amount,
      account: studio.stripe_account_id,
    });

    const stripeFeeDetails = completeCharge.balance_transaction.fee_details.find(fd => fd.type === 'stripe_fee');
    const actualStripeFee = Decimal(stripeFeeDetails.amount).dividedBy(100);
    const expectedStripeFee =
      ['credits', 'packages', 'events', 'giftCards'].reduce(
        (outerAcc, key) =>
          cart[key].reduce(
            (innerAcc, item) => innerAcc.plus(item.dibsTransaction.stripe_fee),
            outerAcc
        ),
        Decimal(0)
      );

    if (!expectedStripeFee.equals(actualStripeFee)) {
      const transactionIds = [
        ...cart.credits,
        ...cart.packages.filter(checkPackItemForCharge),
        ...cart.events.filter(checkEventItemForCharge),
        ...cart.giftCards.filter(checkGiftCardItemForCharge),
      ].map(item => item.dibsTransaction.id);
      mc.ops(
        'Warning: Stripe Fee not properly calculated',
        `A user made a booking at studio ${studio.id} and we calculated the stripe fee incorrectly.\n\nExpected Stripe Fee (on Dibs): ${+expectedStripeFee}\nActual Stripe Fee: ${+actualStripeFee}\n\nTransactions: ${transactionIds}`
      );
    }
  } catch (err) {
    throw new StripeCaptureChargeError(err, { chargeId: charge.id });
  }
};
