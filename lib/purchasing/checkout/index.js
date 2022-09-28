const uuid = require('node-uuid');
const { uniq } = require('lodash');
const Promise = require('bluebird');

const purchaseErrorLib = require('../../errors/purchasing');
const bookingErrorLib = require('../../errors/booking');
const enrollmentLib = require('../../booking/enrollment');
const stripeErrorLib = require('../../errors/stripe');
const helpers = require('./helpers');
const eventsLib = require('./events');
const packagesLib = require('./packages');
const promoCodeLib = require('./promo-code');
const flashCreditLib = require('./flash-credits');
const passesLib = require('./passes');
const stripeLib = require('./stripe');
const creditsLib = require('./credits');
const unenrollmentLib = require('../../booking/unenrollment');
const StripeClient = require('../../stripe/client');
const emailLib = require('../../emails/checkout');
const userStudioBuilder = require('../../helpers/build-user-studio');
const giftCardLib = require('./gift-cards');
const giftCardEmailLib = require('../../emails/gift-cards');
const store = require('./store');
const referralLib = require('../../referrals');

const sc = new StripeClient();

/*

Checkout code

Expects cart of the form:

{
  events: [{ eventid, price, passid, quantity }],
  packages: [{ packageid, autopay, quantity }],
  credits: [{ creditTierId, quantity }],
  giftCard: [{ amount, recipientEmail, dibsStudioId, to, from, message }],
}

*/

const checkoutLib = {};

/**
 * @param {Object} failedPurchase failure result from handleStudioCart
 * @returns {Object} with relevant studio and error that caused failure
 */
function getErrorAndStudioFromFailedPurchase(failedPurchase) {
  const { err, cart } = failedPurchase;
  const studio = helpers.getCartStudio(cart);
  return { err, studio };
}

/**
 * @param {PurchaseError} err that was thrown in code
 * @param {Object}        args passed to function
 * @param {Object}        args.user making purchase
 * @param {Array<Object>} args.cart being purchased
 * @param {Object}        args.promoCode applied to purchase
 * @param {number}        args.dibsStudioId the studio we were checking events out for
 *                                          when the error is thrown
 * @param {Object}        args.studio the studio where the classes being purchased are
 * @returns {Object} failure response json
 */
checkoutLib.handleCheckoutError = function handleCheckoutError(err, {
  user,
  cart,
  studio,
  promoCode,
  returnResponse,
  employeeid,
  purchasePlace,
}) {
  switch (err.constructor) {
    case stripeErrorLib.StripePreChargeError:
    case stripeErrorLib.StripeCaptureChargeError:
    case stripeErrorLib.StripeSubscriptionError:
      return stripeErrorLib.handleStripeError({
        err,
        source: stripeErrorLib.StripeErrorSources.ClassPurchase,
        user,
        cart,
        studio,
        returnResponse,
        employeeid,
      });

    case bookingErrorLib.EnrollmentError:
    case bookingErrorLib.AvailabilityValidationError:
    case bookingErrorLib.MaximumEnrollmentError:
      return bookingErrorLib.handleBookingError({
        err,
        user,
        cart: cart.events,
        studio,
        returnResponse,
        employeeid,
        purchasePlace,
      });

    default:
      return purchaseErrorLib.handlePurchaseError({
        err,
        user,
        cart,
        promoCode,
        studio,
        returnResponse,
        employeeid,
        purchasePlace,
      });
  }
};

/**
 * @param {Object} args passed to function
 * @param {number} args.dibsStudioId for studio the purchase is for
 * @param {Object} args.user who the purchase is for
 * @param {Object} args.cart which is getting checkout out
 * @param {string} args.purchasePlace where transaction is made
 * @param {number} args.employeeid of employee acting on user's behalf
 * @param {boolean} args.sendEmail if false, will skip sending receipt email
 * @returns {Object} API response
 */
checkoutLib.handleStudioCart = async function handleStudioCart({
  dibsStudioId,
  user,
  cart: _cart,
  purchasePlace,
  checkoutUUID,
  employeeid,
  sendEmail,
}) {
  let cart = _cart;
  let charge = false;
  let needsUnenroll = false;
  let needsUnsubscribe = false;
  let subscriptionIds = [];

  const studio = helpers.getCartStudio(cart);

  store.addActiveStudioCheckout(checkoutUUID, dibsStudioId);
  try {
    if (cart.events.length) {
      let clientid;
      if (studio.source !== 'zf') {
        const userStudio = await userStudioBuilder.build(user, dibsStudioId);
        clientid = userStudio.clientid;
        await enrollmentLib.validateCartAvailability({
          user,
          clientid,
          eventItems: cart.events,
          employeeid,
        });
      } else {
        await enrollmentLib.validateDibsCartAvailability({
          user,
          eventItems: cart.events,
          employeeid,
        });
      }
    }
    cart = await flashCreditLib.associateFlashCreditsToCartEventItems(user, cart, dibsStudioId);
    cart = await packagesLib.buildPackageTransactions(
      { user, cart, purchasePlace, checkoutUUID, employeeid });
    cart = packagesLib.buildPasses(user, cart);
    cart = await passesLib.validateAndAssociatePassesToCart(user, cart);
    cart = await eventsLib.buildClassTransactions(
      { user, cart, employeeid, purchasePlace, checkoutUUID });
    cart = await creditsLib.buildCreditDibsTransactions(
      { user, cart, employeeid, purchasePlace, checkoutUUID });
    cart = await giftCardLib.buildGiftCardTransactions(
      { user, cart, employeeid, purchasePlace, checkoutUUID });

    await models.sequelize.transaction(async (sqlTransaction) => {
      cart = await flashCreditLib.markFlashCreditsAsUsed(user, cart, sqlTransaction);
      cart = await promoCodeLib.markPromoCodeAsUsed(user, cart, sqlTransaction);

      cart = await creditsLib.createOrUpdateCredit(user, cart, sqlTransaction);

      cart = await creditsLib.applyStudioCreditToCart(user, cart, sqlTransaction);
      cart = await creditsLib.applyRAFCreditToCart(user, cart, sqlTransaction);

      const chargeResult = await stripeLib.preChargeForCart(user, cart, sqlTransaction);
      const {
        success: isChargeSuccessful,
        err,
      } = chargeResult;
      if (!isChargeSuccessful) throw err;
      ({
        charge,
        cart,
      } = chargeResult);

      if (cart.events.length) {
        store.setStudioCheckoutStartedEnrollment(checkoutUUID, dibsStudioId);
        needsUnenroll = true; // TODO update to use counter
        if (studio.dibs_config.use_spot_booking) {
          cart.events.map(item =>
            (item.dibsTransaction.spot_id = item.spotId));
        }
        if (studio.source !== 'zf') {
          await enrollmentLib.enrollUserInCartEvents(user, cart.events);
        } else {
          await Promise.map(cart.events, async (c) => {
            await models.attendees.findOrCreate({
              where: {
                attendeeID: String(c.dibsTransaction.id),
                dibs_studio_id: studio.id,
              },
              defaults: {
                source: 'zf',
                studioID: c.dibsTransaction.studioid,
                clientID: '',
                dropped: false,
                classID: c.event.classid,
                visitDate: c.event.start_date,
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                userid: user.id,
                eventid: c.eventid,
                spot_id: c.dibsTransaction.spot_id,
              },
            });
          });
        }

        store.setStudioCheckoutEnrolled(checkoutUUID, dibsStudioId);
      }

      cart = await giftCardLib.buildGiftCards(user, cart, sqlTransaction);

      if (charge) {
        await stripeLib.captureChargeForCart({
          cart,
          charge,
          studio,
        });
        store.setStudioCheckoutCharged(checkoutUUID, dibsStudioId);
      }

      ({
        cart,
        needsUnsubscribe,
        subscriptionIds,
      } = await packagesLib.createSubscriptions(
        { user, cart, sqlTransaction }));

      cart = await passesLib.applyPassesToClasses(cart, sqlTransaction);

      cart = {
        ...cart,
        credits: await Promise.map(
          cart.credits,
          helpers.markTransactionsAsSuccess.bind(null, sqlTransaction)),
        events: await Promise.map(
          cart.events,
          helpers.markTransactionsAsSuccess.bind(null, sqlTransaction)),
        giftCards: await Promise.map(
          cart.giftCards,
          helpers.markTransactionsAsSuccess.bind(null, sqlTransaction)),
        packages: await Promise.map(cart.packages, async item => ({
          ...(await helpers.markTransactionsAsSuccess(sqlTransaction, item)),
          pass: (
            item.pass
            && await item.pass.restore({ transaction: sqlTransaction })
          ),
        })),
      };
    });
    store.setStudioCheckoutCommitted(checkoutUUID, dibsStudioId);

    eventsLib.updateSpotCounts(cart).catch(err =>
      purchaseErrorLib.handlePurchaseError({
        err,
        user,
        cart,
        employeeid,
        studio,
      }));

    if (cart.events.length) {
      enrollmentLib.updateAttendance(user, studio);
    }
    emailLib.sendTransactionsEmail({
      user,
      cart,
      purchasePlace,
      employeeid,
      checkoutUUID,
    });
    emailLib.sendSpotBookingEmail(user, cart);
    cart.giftCards.forEach(item =>
      giftCardEmailLib.sendGiftCardEmail({
        ...item,
        user,
        employeeid,
      }));

    const studioCartTransactions =
      helpers.getCartItems(cart).map(item => item.dibsTransaction);

    if (studio.dibs_config.use_spot_booking) {
      await eventsLib.updateSeatNumber(studioCartTransactions, studio);
    }

    if (sendEmail) {
      emailLib.sendConfirmationEmail({
        user,
        transactions: studioCartTransactions,
        employeeid,
      });
      store.setStudioCheckoutReceiptSent(checkoutUUID, dibsStudioId);
    }
    referralLib.checkTransactionsForReferrals(studioCartTransactions);

    return { success: true, dibsStudioId, cart };
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('handleStudioCart caught:\n', err);
    }
    if (charge) stripeLib.refundCart(user, cart, charge);
    if (needsUnenroll) { // only set true if the cart has events
      const transactions = cart.events.map((item) => {
        const transaction = item.dibsTransaction;
        transaction.event = item.event;
        if (item.pass) transaction.pass = item.pass;
        return transaction;
      });
      unenrollmentLib.unenrollUserFromEvents({
        user,
        transactions,
        studio,
        sales: err.sales,
      }).catch(err => bookingErrorLib.handleBookingError({
        err: new bookingErrorLib.UnenrollmentError(err),
        user,
        studio,
        eventids: uniq(cart.events.map(({ eventid }) => eventid)),
        employeeid,
        purchasePlace,
      }));
    }
    if (needsUnsubscribe) {
      subscriptionIds.forEach(subscriptionId =>
        sc.cancelSubscriptionPlan({
          stripeAccountId: studio.stripe_account_id,
          stripeSubscriptionId: subscriptionId,
        })
        .catch(err => stripeErrorLib.handleStripeError({
          user,
          cart,
          studio,
          err: new stripeErrorLib.StripeSubscriptionError(err, { forUnsubscribe: true }),
          employeeid,
        })));
    }
    return { success: false, dibsStudioId, err, cart };
  }
};

/**
 * @param {Object} user who the purchase is for
 * @param {Object} cart which is getting checkout out
 * @param {Object} promoCode used at checkout
 * @param {string} purchasePlace where transaction is made
 * @param {number} employeeid of employee acting on user's behalf
 * @param {boolean} dibsAdmin if the person making the purchase is doing so through admin tools (triggers price validation skip)
 * @param {boolean} sendEmail if false will not send receipt emails
 * @returns {Object} API response
 */
checkoutLib.checkoutCart = async function checkoutCart({
  user,
  cart: _cart,
  promoCode = null,
  purchasePlace = null,
  employeeid = null,
  // dibsAdmin = false,
  sendEmail = true,
}) {
  let cart = _cart;
  const checkoutUUID = uuid.v1();
  store.addActiveCheckout(checkoutUUID, cart);
  try {
    cart = helpers.validateCart(cart);
    await giftCardLib.validateRecipientEmails(user, cart);
    cart = {
      credits: await creditsLib.queryCreditTiers(cart.credits),
      packages: await packagesLib.queryPackages(cart.packages),
      events: await eventsLib.queryEvents(cart.events),
      giftCards: await giftCardLib.queryGiftCardStudios(cart.giftCards),
    };
    // removing validate event prices - causing unnecessary errors - 7/19/21
    // if (!dibsAdmin) await eventsLib.validateEventPrices(user, cart);
    await packagesLib.validatePackages(user, cart);
    cart = {
      credits: helpers.expandCartItems('credits', cart),
      packages: helpers.expandCartItems('packages', cart),
      events: helpers.expandCartItems('events', cart, employeeid),
      giftCards: cart.giftCards,
    };
    cart = {
      credits: cart.credits,
      packages: await helpers.cartSorts.sortPackages(cart),
      events: helpers.cartSorts.sortEvents(cart),
      giftCards: cart.giftCards,
    };
    cart = await promoCodeLib.associatePromoCodeToCart(user, cart, promoCode);
    const cartByStudio = helpers.expandCartByStudio(cart);
    const cartByStudioEntries = Object.entries(cartByStudio);
    const checkoutResult = await Promise.map(
      cartByStudioEntries,
      ([dibsStudioId, studioCart]) =>
        checkoutLib.handleStudioCart({
          dibsStudioId: Number(dibsStudioId),
          user,
          cart: studioCart,
          purchasePlace,
          employeeid,
          checkoutUUID,
          sendEmail,
        }));
    const hadSuccessfulPurchases =
      checkoutResult.some(result => result.success);
    const failedPurchases =
      checkoutResult.filter(result => !result.success);

    if (!hadSuccessfulPurchases && failedPurchases.length === 1) { // only made a purchase at one studio and it failed
      const { studio, err } =
        getErrorAndStudioFromFailedPurchase(failedPurchases[0]);
      store.completeActiveCheckout(checkoutUUID);
      return checkoutLib.handleCheckoutError(err, {
        user,
        cart,
        studio,
        employeeid,
        purchasePlace,
        promoCode,
        returnResponse: true,
      });
    }
    if (failedPurchases.length > 0) { // failed to purchase at multiple studios
      failedPurchases.forEach((failedPurchase) => {
        const { studio, err } =
          getErrorAndStudioFromFailedPurchase(failedPurchase);
        checkoutLib.handleCheckoutError(err, {
          user,
          cart: failedPurchase.cart,
          studio,
          employeeid,
          purchasePlace,
          promoCode: helpers.getCartItems(failedPurchase.cart).find(item => item.promoCode),
        });
      });
    }
    if (!hadSuccessfulPurchases) { // failed to purchase at multiple studios and none were successful
      store.completeActiveCheckout(checkoutUUID);
      return apiFailureWrapper(
        {}, 'Sorry, something went wrong checking out your cart.');
    }

    const transactions =
      helpers.getTransactionsFromCheckoutResult(checkoutResult);

    await user.reloadAndUpdateRedis();
    store.completeActiveCheckout(checkoutUUID);
    return apiSuccessWrapper({
      transactions,
      user: {
        ...user.clientJSON(),
        ...(cartByStudioEntries.length === 1
            && { hasMadePurchaseAtStudio: true }),
      },
      failedPurchases: failedPurchases.length > 0,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('checkoutCart caught:\n', err);
    }
    store.completeActiveCheckout(checkoutUUID);
    return checkoutLib.handleCheckoutError(err, {
      user,
      cart,
      promoCode,
      employeeid,
      returnResponse: true,
      purchasePlace,
    });
  }
};

module.exports = checkoutLib;
