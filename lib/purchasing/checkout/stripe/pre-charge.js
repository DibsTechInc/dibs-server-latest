const Decimal = require('decimal.js');
const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');
const { MIN_CHARGE_ADJUSTMENT_CUTOFF } = require('../../../stripe/constants');
const StripeClient = require('../../../stripe/client');
const { StripePreChargeError } = require('../../../errors/stripe');
const {
  checkEventItemForCharge,
  checkPackItemForCharge,
  checkGiftCardItemForCharge,
} = require('./helpers');
const cartHelpers = require('../helpers');

const mc = new MailClient();
const sc = new StripeClient();

/**
 * @param {number} chargeAmount total charge amount
 * @param {Object} sqlTransaction SQL transaction for DB updates
 * @returns {function} curried async reduce callback for setting min charge adjustment
 */
function curryMinChargeAdjCallback(chargeAmount, sqlTransaction) {
  let decreasingChargeAmount = Decimal(chargeAmount);
  return async function minChargeAdjCallback(itemTest, acc, item) {
    if (itemTest(item) && !decreasingChargeAmount.equals(0)) {
      const minChargeAdj = Math.min(item.dibsTransaction.chargeAmount, decreasingChargeAmount);
      decreasingChargeAmount = decreasingChargeAmount.minus(minChargeAdj);
      acc.push({
        ...item,
        dibsTransaction: await item.dibsTransaction.setMinChargeAdjustment(
          minChargeAdj,
          { save: true, transaction: sqlTransaction }
        ),
      });
    } else {
      acc.push(item);
    }
    return acc;
  };
}

/**
 * @param {Object} cart at checkout
 * @param {number} chargeAmount that needs min charge adj
 * @param {Object} sqlTransaction SQL transaction
 * @returns {Object} cart after min charge adj
 */
async function handleMinChargeAdjustment(cart, chargeAmount, sqlTransaction) {
  const transactionids = [
    ...cart.credits,
    ...cart.packages.filter(checkPackItemForCharge),
    ...cart.events.filter(checkEventItemForCharge),
    ...cart.giftCards.filter(checkGiftCardItemForCharge),
  ].map(item => item.dibsTransaction.id);
  const minChargeAdjCallback =
    curryMinChargeAdjCallback(chargeAmount, sqlTransaction);

  mc.ops(
    'Warning: Minimum Charge Adjustment',
    `A user made a purchase which would have resulted in a Stripe charge of: ${chargeAmount}, so no charge was made.\n\nSee transactions ${transactionids}`);

  return {
    ...cart,
    credits: await Promise.reduce(
      cart.credits,
      minChargeAdjCallback.bind(null, () => true),
      []
    ),
    packages: await Promise.reduce(
      cart.packages,
      minChargeAdjCallback.bind(null, checkPackItemForCharge),
      []
    ),
    events: await Promise.reduce(
      cart.events,
      minChargeAdjCallback.bind(null, checkEventItemForCharge),
      []
    ),
    giftCards: await Promise.reduce(
      cart.giftCards,
      minChargeAdjCallback.bind(null, checkGiftCardItemForCharge),
      []
    ),
  };
}

/**
 * @param {Object} studio purchase is being made for
 * @param {number} percentageFees a map of charge amounts to corresponding percentage fee
 * @param {number} totalPercentageFee for the whole charge
 * @param {number} aggregatedPercentageFee sum of percentage fees for each item
 * @param {number} fixedFee fixed part of stripe fee
 * @param {Object} sqlTransaction for db update
 * @param {function} addToStudioPayment takes a number and adds this to the total for studio payment
 * @returns {function} setStripeFee callback
 */
function currySetStripeFee({
  studio,
  percentageFees,
  totalPercentageFee,
  aggregatedPercentageFee,
  fixedFee,
  sqlTransaction,
}) {
  let appliedFixedFee;
  let applicationFee = Decimal(0);
  return {
    getApplicationFee() {
      return Number(applicationFee);
    },
    async setStripeFee(itemTest, acc, item) {
      if (itemTest(item)) {
        let { dibsTransaction } = item;
        let stripeFee = percentageFees[dibsTransaction.chargeAmount];
        if (!appliedFixedFee) {
          // this is to handle the rare case when there are multiple transactions in the
          // Stripe charge whose fees individually would be rounded down (i.e. 1.002 and 1.003)
          // Individually their Stripe fees would have been 1.00 and 1.00, but since the
          // actual Stripe fee is on their combined amount, it's 2.005 = 2.01
          const roundingError = Decimal(totalPercentageFee).minus(aggregatedPercentageFee);
          stripeFee = +Decimal(stripeFee).plus(fixedFee).plus(roundingError).toDP(2);
          appliedFixedFee = true;
        }
        const location =
          (item.event && item.event.location)
          || (studio.locations[0]);
        dibsTransaction = await dibsTransaction.setStripeFee(stripeFee)
          .calculateTaxWithheld(Decimal(location.tax_rate).dividedBy(100))
          .calculateDibsFee(studio)
          .calculateStudioPayment({ save: true, transaction: sqlTransaction });
        applicationFee = applicationFee.plus(dibsTransaction.applicationFee);
        acc.push({ ...item, dibsTransaction });
        return acc;
      }
      acc.push(item);
      return acc;
    },
  };
}

/**
 * @param {Object} charge object from stripe response
 * @param {Object} sqlTransaction SQL transaction for atomic update
 * @param {function} itemTest to see if charge applies to item
 * @param {Object} item to set stripe charge id for
 * @returns {Object} item with charge id stored
 */
async function setStripeChargeId(charge, sqlTransaction, itemTest, item) {
  if (itemTest(item)) {
    const { dibsTransaction } = item;
    return {
      ...item,
      dibsTransaction: await dibsTransaction.setStripeChargeId(charge.id, {
        save: true,
        transaction: sqlTransaction,
      }),
    };
  }
  return item;
}

/**
 * @param {Object} user making the purchase
 * @param {Object} cart user is checking out
 * @param {Object} sqlTransaction SQL transaction
 * @returns {Object} cart after pre-charge
 */
module.exports = async function preChargeForCart(user, cart, sqlTransaction) {
  const itemsThatNeedCharge = [
    ...cart.credits,
    ...cart.packages.filter(checkPackItemForCharge),
    ...cart.events.filter(checkEventItemForCharge),
    ...cart.giftCards.filter(checkGiftCardItemForCharge),
  ];
  if (itemsThatNeedCharge.length === 0) return { success: true, cart };

  const totalChargeAmount = +itemsThatNeedCharge.reduce(
    (acc, item) => acc.plus(item.dibsTransaction.chargeAmount),
    Decimal(0)
  );
  const studio = cartHelpers.getCartStudio(cart);

  let charge;

  try {
    if (totalChargeAmount < MIN_CHARGE_ADJUSTMENT_CUTOFF) {
      const minAdjustedCart = await handleMinChargeAdjustment(cart, totalChargeAmount, sqlTransaction);
      return { success: true, cart: minAdjustedCart };
    }

    const card = await sc.lastFour(user);
    const {
      percentage: totalPercentageFee,
      fixed: fixedFee,
    } = sc.getStripeFee({ amount: totalChargeAmount, card, currency: studio.currency });

    const percentageFees = {}; // memoize stripe fees to avoid recomputation

    const aggregatedPercentageFee =
      itemsThatNeedCharge.reduce((acc, item) => {
        if ((item.event && !checkEventItemForCharge(item))
          || (item.package && !checkPackItemForCharge(item))
          || (item.giftCard && !checkGiftCardItemForCharge(item))) return acc;
        const { chargeAmount } = item.dibsTransaction;
        if (percentageFees[chargeAmount]) return acc.plus(percentageFees[chargeAmount]);
        const { percentage } = sc.getStripeFee({ amount: chargeAmount, card, currency: studio.currency });
        if (!percentageFees[chargeAmount]) percentageFees[chargeAmount] = percentage;
        return acc.plus(percentage);
      }, Decimal(0));

    const { getApplicationFee, setStripeFee } = currySetStripeFee({
      studio,
      percentageFees,
      totalPercentageFee,
      aggregatedPercentageFee,
      fixedFee,
      sqlTransaction,
    });

    const cartAfterFees = {
      ...cart,
      credits: await Promise.reduce(
        cart.credits,
        setStripeFee.bind(null, () => true),
        []
      ),
      packages: await Promise.reduce(
        cart.packages,
        setStripeFee.bind(null, checkPackItemForCharge),
        []
      ),
      events: await Promise.reduce(
        cart.events,
        setStripeFee.bind(null, checkEventItemForCharge),
        []
      ),
      giftCards: await Promise.reduce(
        cart.giftCards,
        setStripeFee.bind(null, checkGiftCardItemForCharge),
        []
      ),
    };
    const managedAccountCustomerId = await sc.findOrCreateManagedAccountCustomer({
      user,
      studio,
    });
    charge = await sc.preChargeCard({
      customerId: managedAccountCustomerId,
      amount: +totalChargeAmount,
      currency: studio.currency.toLowerCase(),
      description: `${studio.name} - Purchase - Dibs`,
      account: studio.stripe_account_id,
      statementDescriptor: studio.name,
      applicationFee: getApplicationFee(),
    });

    const cartWithChargeIds = {
      ...cartAfterFees,
      credits: await Promise.map(
        cartAfterFees.credits,
        setStripeChargeId.bind(null, charge, sqlTransaction, () => true)),
      packages: await Promise.map(
        cartAfterFees.packages,
        setStripeChargeId.bind(null, charge, sqlTransaction, checkPackItemForCharge)),
      events: await Promise.map(
        cartAfterFees.events,
        setStripeChargeId.bind(null, charge, sqlTransaction, checkEventItemForCharge)),
      giftCards: await Promise.map(
        cartAfterFees.giftCards,
        setStripeChargeId.bind(null, charge, sqlTransaction, checkGiftCardItemForCharge)),
    };
    return { success: true, charge, cart: cartWithChargeIds };
  } catch (err) {
    return { success: false, charge, err: new StripePreChargeError(err) };
  }
};
