const { handleError } = require('../index');
const { StripeErrorSources } = require('./types');
const { getPronounForErrorMsg } = require('../helpers/error-message-helper');

/**
 * @param {string} source of the error
 * @param {string} type of Stripe error thrown
 * @returns {string} formatted ops subject
 */
function getOpsSubject(source, type) {
  switch (source) {
    case StripeErrorSources.Checkout:
    case StripeErrorSources.ClassPurchase:
      return `Purchase Error: Stripe Error: ${type}`;
    default:
      return `Stripe Error: ${type}`;
  }
}

const resMessage = (message, user, employeeid) => (
  /declined|insufficient funds/i.test(message) ?
    `Sorry, ${getPronounForErrorMsg('your', user, employeeid)} card was declined. Please update ${getPronounForErrorMsg('your', user, employeeid)} payment information and try again.`
    : `Sorry, something went wrong charging ${getPronounForErrorMsg('your', user, employeeid)} card, please make sure ${getPronounForErrorMsg('your', user, employeeid)} payment is up to date.`
);

module.exports = {
   /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {PurchaseError} args.err that was thrown in code
   * @param {string}        args.stringifiedCart from checkout at class purchase
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @returns {Object} failure response json
   */
  handlePreChargeError({ source, user, err, studio, stringifiedCart, returnResponse = false, employeeid }) {
    handleError({
      stringifiedCart,
      userid: user.id,
      opsSubject: getOpsSubject(source, 'Pre-capture Error'),
      opsBody: `Something went wrong pre-charging user ${user.id}'s card while making a class purchase at studio ${studio.id}.`,
      opsIncludes: `Cart: ${stringifiedCart}`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, resMessage(err.message, user, employeeid));
    return null;
  },

   /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {PurchaseError} args.err that was thrown in code
   * @param {string}        args.stringifiedCart from checkout at class purchase
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @returns {Object} failure response json
   */
  handleCaptureChargeError({ source, user, err, studio, stringifiedCart, returnResponse = false, employeeid }) {
    handleError({
      stringifiedCart,
      userid: user.id,
      opsSubject: getOpsSubject(source, 'Charge Capture Error'),
      opsBody: `Something went wrong capturing charge ${err.chargeId} in Stripe for user ${user.id} while making a class purchase at studio ${studio.id}.`,
      opsIncludes: `Cart: ${stringifiedCart}`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, resMessage(err.message, user, employeeid));
    return null;
  },

  /**
  * @param {Object}        args passed to function
  * @param {Object}        args.user making purchase
  * @param {PurchaseError} args.err that was thrown in code
  * @param {string}        args.stringifiedCart from checkout at class purchase
  * @param {number}        args.studio the studio we were checking events out for
  *                                    when the error is thrown
  * @returns {Object} failure response json
  */
  handleChargeError({ source, user, err, studio, stringifiedCart, returnResponse = false, employeeid }) {
    handleError({
      stringifiedCart,
      userid: user.id,
      opsSubject: getOpsSubject(source, 'Charge Error'),
      opsBody: `Something went wrong charging ${err.chargeId} in Stripe for user ${user.id} while making a class purchase at studio ${studio.id}.`,
      opsIncludes: `Cart: ${stringifiedCart}`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, resMessage(err.message, user, employeeid));
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {PurchaseError} args.err that was thrown in code
   * @param {string}        args.stringifiedCart from checkout at class purchase
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @returns {Object} failure response json
   */
  handleRefundError({ source, user, err, studio, stringifiedCart, returnResponse = false, employeeid }) {
    handleError({
      stringifiedCart,
      userid: user.id,
      opsSubject: getOpsSubject(source, 'Refund Error'),
      opsBody: `Something went wrong capturing charge ${err.chargeId} in Stripe for user ${user.id} while making a class purchase at studio ${studio.id}.`,
      opsIncludes: `Cart: ${stringifiedCart}`,
      employeeid,
    })(err);
    if (returnResponse) {
      return apiFailureWrapper({}, 'Sorry, there was an error refunding that transaction.');
    }
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {PurchaseError} args.err that was thrown in code
   * @param {string}        args.stringifiedCart from checkout at class purchase
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @returns {Object} failure response json
   */
  handleSubscriptionError({ user, err, studio, stringifiedCart, returnResponse = false, employeeid }) {
    handleError({
      stringifiedCart,
      userid: user.id,
      opsSubject: 'Purchase Error: Subscription Error',
      opsBody: `Something went wrong ${err.forUnsubscribe ? 'canceling' : 'setting up'} a subscription for user ${user.id} while making a purchase at studio ${studio.id}.`,
      opsIncludes: `Cart: ${stringifiedCart}`,
      employeeid,
    })(err);
    if (returnResponse) {
      return apiFailureWrapper({}, 'Sorry, there was an error setting up your subscription.');
    }
    return null;
  },
};
