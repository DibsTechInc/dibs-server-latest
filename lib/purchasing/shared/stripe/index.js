const StripeClient = require('../../../stripe/client');
const stripeErrorLib = require('../../../errors/stripe');
const MailClient = require('@dibs-tech/mail-client');
const Decimal = require('decimal.js');
const Promise = require('bluebird');
const moment = require('moment');

const sc = new StripeClient();
const mc = new MailClient();

module.exports = {
  /**
   * Charges card for retail purchase
   * @param {object} dibsTransaction  transaction instance
   * @param {object} user  user instance
   * @param {object} studio  studio instance
   * @returns {object} charge data
   */
  async charge({ dibsTransaction, user, studio, description }) {
    const managedAccountCustomerId = await sc.findOrCreateManagedAccountCustomer({ user, studio });
    try {
      const charge = await sc.chargeCard({
        customerId: managedAccountCustomerId,
        amount: dibsTransaction.chargeAmount,
        description,
        currency: studio.currency,
        applicationFee: dibsTransaction.applicationFee,
        account: studio.stripe_account_id,
        statementDescriptor: studio.name,
      });

      const stripeFeeDetails = charge.balance_transaction.fee_details.find(fd => fd.type === 'stripe_fee');
      const actualStripeFee = Decimal(stripeFeeDetails.amount).dividedBy(100);
      const expectedStripeFee = Decimal(dibsTransaction.stripe_fee);

      if (!expectedStripeFee.equals(actualStripeFee)) {
        mc.ops(
          'Warning: Stripe Fee not properly calculated',
          `A user made a booking at studio ${studio.id} and we calculated the stripe fee incorrectly.\n\nExpected Stripe Fee (on Dibs): ${+expectedStripeFee}\nActual Stripe Fee: ${+actualStripeFee}\n\nTransaction: ${dibsTransaction.id}`
        );
      }
      return charge;
    } catch (err) {
      throw new stripeErrorLib.StripeChargeError(err);
    }
  },
  /**
   *
   * @param {object} user  user instance
   * @param {number} chargeAmount amount being charged
   * @param {string} currency currency of charge
   * @returns {number} total fee
   */
  async calculateStripeFee(user, chargeAmount, currency) {
    const card = await sc.lastFour(user);
    const { total } = await sc.getStripeFee({ amount: chargeAmount, card, currency });
    return total;
  },
  /**
   *
   * @param {string} chargeId     original charge id
   * @param {Object} studio       studio to refund the charge
   * @returns {promise} resolved  refund object
   */
  async refund(chargeId, studio, { sqlTransaction = {}, save = false, transaction = null } = {}) {
    try {
      const refund = await sc.refund(chargeId, {
        stripeAccountId: studio.stripe_account_id,
      });
      if (transaction) {
        transaction.stripe_refund_id = refund.id;
        transaction.studio_payment = 0;
        transaction.stripe_fee = 0;
        transaction.dibs_fee = 0;
        transaction.tax_withheld = 0;
        if (save) {
          await transaction.save(sqlTransaction ? { transaction: sqlTransaction } : undefined);
        }
      }
      return refund;
    } catch (err) {
      throw new stripeErrorLib.StripeRefundError(err, { chargeId });
    }
  },

  /**
   * @param {Object} dibsTransaction with small charge
   * @param {number} chargeAmount under 0.50, aggregated amount over cart
   * @param {Object} sqlTransaction SQL transaction
   * @returns {Array<Object>} cart with min charge adjustment
   */
  async handleTransactionMinChargeAdjustment(dibsTransaction, { sqlTransaction = {}, save = false, sendEmail = true } = {}) {
    if (sendEmail) {
      mc.ops(
        'Warning: Minimum Charge Adjustment',
        `A user made a purchase which would have resulted in a Stripe charge of: ${dibsTransaction.chargeAmount}, so no charge was made.\n\nSee transaction ${dibsTransaction.id}`
      );
    }
    return dibsTransaction.setMinChargeAdjustment(
      dibsTransaction.chargeAmount,
      { save, transaction: sqlTransaction }
    );
  },

  /**
   * @param {Array<Object>} cart user is attempting to check out, single studio
   * @param {number} chargeAmount under 0.50, aggregated amount over cart
   * @param {Object} sqlTransaction SQL transaction
   * @returns {Array<Object>} cart with min charge adjustment
   */
  async handleCartMinChargeAdjustment(cart, chargeAmount, sqlTransaction) {
    const transactionids = cart.map(({ dibsTransaction }) => dibsTransaction.id).join(', ');
    let decreasingChargeAmount = Decimal(chargeAmount);

    mc.ops(
      'Warning: Minimum Charge Adjustment',
      `A user made a purchase which would have resulted in a Stripe charge of: ${chargeAmount}, so no charge was made.\n\nSee transactions ${transactionids}`
    );

    return Promise.map(cart, async (item) => {
      if (decreasingChargeAmount.equals(0)) return item;

      const minChargeAdj = Math.min(item.dibsTransaction.chargeAmount, +decreasingChargeAmount);
      decreasingChargeAmount = decreasingChargeAmount.minus(minChargeAdj);

      return {
        ...item,
        dibsTransaction: await item.dibsTransaction.setMinChargeAdjustment(
          minChargeAdj,
          { save: true, transaction: sqlTransaction }
        ),
      };
    }, { concurrency: 1 });
  },

  async subscribeUserToPlan({ studioPackage, user, promoCode = {}, sqlTransaction } = {}) {
    const managedAccountCustomerId = await sc.findOrCreateManagedAccountCustomer({ user, studio: studioPackage.studio });
    // Because subscriptions are required to go through the Connect account
    // versus Platform account, we need to calculate the application fee to include
    // the tax so that we withhold that in our account
    const widgetFee = +studioPackage.studio.widget_fee_rate;
    const taxRate = Decimal(studioPackage.studio.locations[0].tax_rate).dividedBy(100).toNumber();
    // math is 1 - ((x - widgetfee * x) / (x + taxrate * x))
    const applicationFee = (Decimal(1).minus((Decimal(1).minus(widgetFee)).dividedBy(Decimal(1).plus(taxRate))));
    const applicationFeePercent = Decimal(applicationFee).times(100).toDecimalPlaces(2).toNumber();

    // Subscribe user to plan
    const now = moment();
    const subscription = await sc.subscribeToPlan({
      stripeAccountId: studioPackage.studio.stripe_account_id,
      managedAccountCustomerId,
      applicationFeePercent,
      stripePlanId: studioPackage.stripe_plan_id,
      taxPercent: studioPackage.studio.locations[0].tax_rate || 0,
      trialPeriodDays: now.clone().add(studioPackage.autopayIncrementCount, studioPackage.autopayIncrement).diff(now, 'days'),
      coupon: promoCode.stripe_coupon_id,
    });

    try {
      // Create userAutopayPackage in our database to keep track of stripe subscription id
      const userAutopayPackage = await models.dibs_user_autopay_packages.create({
        studio_package_id: studioPackage.id,
        userid: user.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
      }, { transaction: sqlTransaction, returning: true });

      return userAutopayPackage;
    } catch (err) {
      sc.cancelSubscriptionPlan({
        stripeAccountId: stripeErrorLib.studio.stripe_account_id,
        stripeSubscriptionId: subscription.id,
      })
      .catch(err => stripeErrorLib.handleStripeError({
        user,
        studio: studioPackage.studio,
        err: new stripeErrorLib.StripeSubscriptionError(err, { forUnsubscribe: true }),
      }));
      throw err;
    }
  },
};
