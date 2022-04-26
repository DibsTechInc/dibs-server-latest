const { handleError } = require('../index');
const stringifyCart = require('../../purchasing/checkout/helpers/stringify-cart');
const { getPronounForErrorMsg } = require('../helpers/error-message-helper');

module.exports = {
  stringifyCart,

  /**
   * @param {Object} user making purchase
   * @param {Array<Object>} cart being purchased
   * @param {CartError} err thrown when pre-processing cart\
   * @param {number} employeeid making purchase on user's behalf
   * @returns {Object} failure response JSON
   */
  handleCartError({ user, cart, err, employeeid }) {
    const stringifiedCart = cart && stringifyCart(cart);
    handleError({
      log: false,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Cart Error',
      opsBody: `User ${user.id} attempted to check out an invalid cart when making a class purchase.`,
      opsIncludes: `Cart: ${stringifiedCart}`,
    })(err);
    let resMessage =
      `Sorry, it seems ${getPronounForErrorMsg('you', user, employeeid)} current cart is not available for purchase, please refresh and try again.`;
    if (err.invalidRecipientEmail) {
      resMessage = 'Sorry, it seems like the email you want to send this gift to is not valid.';
    }
    return apiFailureWrapper({ invalidRecipientEmail: true }, resMessage);
  },

  /**
   * @param {Object} user making purchase
   * @param {Object} promo code applied to the cart
   * @param {PromoCodeAssociationError} err thrown when pre-processing cart
   * @returns {Object} failure response JSON
   */
  handlePromoCodeAssociationError({ user, cart, promoCode, err, employeeid }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Promo Code Error',
      opsBody: `Something went wrong associating promo code ${promoCode.id} to a user ${user.id}'s cart during a class purchase.`,
    })(err);
    return apiFailureWrapper({}, 'Sorry, that promo code is no longer valid.');
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handleEventPriceValidationError({ user, cart, err, returnResponse = false, employeeid, purchasePlace }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Event Price Validation Error',
      opsBody: `A user's cart has events whose prices have changed. See event ${err.eventid}. User made purchase at ${purchasePlace}`,
    })(err);
    if (returnResponse) {
      let message = `Sorry, the price of one of the classes in ${getPronounForErrorMsg('your', user, employeeid)} cart changed. Please try again. Error 10`;
      if (purchasePlace === models.dibs_transaction.PurchasePlaces.MOBILE_APP) {
        message = 'Sorry, the price of one of the classes in your cart has changed. Please restart the app if you are unable to purchase again';
      }
      return apiFailureWrapper({}, message);
    }
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handlePackagePriceCalculationError({ user, cart, err, returnResponse = false, employeeid }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Package Price Calculation Error',
      opsBody: `There was an error calculating how much a user should be charged for package: ${err.packageid}`,
    })(err);
    if (returnResponse) {
      return apiFailureWrapper({}, `Sorry, the price of one of the classes in ${getPronounForErrorMsg('your', user, employeeid)} cart changed. Please try again.`);
    }
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handleFlashCreditAssociationError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const flashCreditIds = cart.filter(item => item.flashCredit && item.flashCredit.dibs_studio_id === studio.id)
                               .map(item => item.flashCredit.id);
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Flash Credits Error',
      opsBody: `Something went wrong associating flash credit ${flashCreditIds.join(', ')} to user ${user.id}'s cart while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, `Sorry, something went wrong applying ${getPronounForErrorMsg('your', user, employeeid)} flash credits to ${getPronounForErrorMsg('your', user, employeeid)} cart at checkout.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handlePassValidationError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Passes Error',
      opsBody: err.invalidPass ?
        `User ${user.id} attempted to make a class purchage at studio ${studio.id} with invalid pass ${err.passid}.` :
        `Something went wrong associating ${err.passid ? `pass ${err.passid}` : 'passes'} to user ${user.id}'s cart while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({ user: user.clientJSON() }, `Sorry, it seems what’s in ${getPronounForErrorMsg('your', user, employeeid)} cart is not available for purchase. Please refresh and try again, or contact us for assistance.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handleCreateTransactionsError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Create Transactions Error',
      opsBody: `Something went wrong creating dibs_transactions when a user made a class purchase for studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, `Sorry, something went wrong checking out ${getPronounForErrorMsg('your', user, employeeid)} cart.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handleFlashCreditApplicationError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const { flashCredit, dibsTransaction } = cart.find(item => item.flashCredit.id === err.flashCreditId);
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Flash Credits Error',
      opsBody: `Something went wrong marking flash credit ${flashCredit.id} as used on transaction ${dibsTransaction.id} in user ${user.id}'s cart while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, `Sorry, something went wrong applying ${getPronounForErrorMsg('your', user, employeeid)} flash credits to ${getPronounForErrorMsg('your', user, employeeid)} checkout.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handlePromoCodeApplicationError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const { promoCode, dibsTransaction } = cart.find(item => item.promoCode);
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Promo Code Error',
      opsBody: `Something went applying promo code ${promoCode.id} to transaction ${dibsTransaction.id} in user ${user.id}'s cart while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, `Sorry, something went wrong applying that promo code to ${getPronounForErrorMsg('your', user, employeeid)} cart at checkout.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handlePassApplicationError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const transactionIds = err.passid && cart.filter(({ passid }) => passid === err.passid)
                                             .map(({ dibsTransaction }) => dibsTransaction.id);
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Passes Error',
      opsBody: `Something went wrong marking passes ${transactionIds ? `${transactionIds.join(', ')} ` : ''}in user ${user.id}'s cart while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, `Sorry, something went wrong applying ${getPronounForErrorMsg('your', user, employeeid)} packages to ${getPronounForErrorMsg('your', user, employeeid)} cart at checkout.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @returns {Object} failure response json
   */
  handleCreditApplicationError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const creditTypes = {
      studio: 'Studio',
      raf: 'Refer-A-Friend',
    };
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: `Purchase Error: ${creditTypes[err.type]} Credit Error`,
      opsBody: `Something went wrong applying ${creditTypes[err.type].toLowerCase()} credit to user ${user.id}'s cart while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, `Sorry, something went wrong applying ${getPronounForErrorMsg('your', user, employeeid)} credit to ${getPronounForErrorMsg('your', user, employeeid)} cart at checkout.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @returns {Object} failure response json
   */
  handleUpdateSpotCountError({ user, cart, err, studio, returnResponse = false, employeeid }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Update Spot Count Error',
      opsBody: `Something went wrong updating the events in user ${user.id}'s cart while they were making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, `Sorry, something went wrong checking out ${getPronounForErrorMsg('your', user, employeeid)} cart.`);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @returns {Object} failure response json
   */
  handlePackagePurchaseError({ user, cart, err, returnResponse = false, employeeid }) {
    let responseMessage;
    let opsMessage = '';

    let stringifiedCart;
    if (cart) stringifiedCart = stringifyCart(cart);

    switch (true) {
      case err.firstPurchaseError:
        responseMessage = 'This package is only available as a first purchase at this studio.';
        opsMessage = 'First purchase error';
        break;
      case err.packageLimitError:
        responseMessage = `Sorry, ${getPronounForErrorMsg('you', user, employeeid)} have already purchased this package the maximum number of times.`;
        opsMessage = 'Package limit error';
        break;
      case err.promoCodeError:
        responseMessage = 'The promo code you used is no longer valid.';
        opsMessage = 'Promo code error';
        break;
      default:
        responseMessage = `Oh no! Something went wrong purchasing ${getPronounForErrorMsg('your', user, employeeid)} package`;
    }
    handleError({
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Package Purchase Error',
      opsBody: `Something went wrong purchasing the package ${err.studioPackageId} for ${user.id}. ${opsMessage}`,
      opsIncludes: err.transaction ? `Transaction id ${err.transaction.id}` : undefined,
      stringifiedCart,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, responseMessage);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @returns {Object} failure response json
   */
  handleCreditPurchaseError({ user, cart, err, returnResponse = false, employeeid }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Credit Purchase Error',
      opsBody: `Something went wrong purchasing credit tier ${err.creditTierId} for user ${user.id}.`,
      stringifiedCart,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, 'Something went wrong purchasing credit.');
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {PurchaseError} args.err that was thrown in code
   * @param {Object}        args.waitlistTransaction that failed to be charged
   * @returns {Object} failure response json
   */
  handleWaitlistChargeError({ err, waitlistTransaction }) {
    handleError({
      opsSubject: 'Waitlist Charge Error',
      userid: waitlistTransaction.userid,
      opsIncludes: `Waitlist transaction ${waitlistTransaction.id}`,
    })(err);
  },
};
