const types = require('./types');
const {
  handlePreChargeError,
  handleCaptureChargeError,
  handleRefundError,
  handleChargeError,
  handleSubscriptionError,
} = require('./handlers');
const { handleError } = require('../index');
const stringifyCart = require('../../purchasing/checkout/helpers/stringify-cart');

/**
 * @param {Object}        args passed to function
 * @param {string}        args.source of the Stripe Error, should be a StripeErrorSource (see types)
 * @param {Object}        args.user making purchase
 * @param {Array<Object>} args.cart being purchased
 * @param {PurchaseError} args.err that was thrown in code
 * @param {string}        args.stringifiedCart from checkout at class purchase
 * @param {number}        args.studio the studio we were checking events out for
 *                                    when the error is thrown
 * @returns {Object} failure response json
 */
async function handleStripeError({ source, user, cart, err, studio = null, returnResponse, employeeid }) {
  const stringifiedCart = cart && stringifyCart(cart);
  switch (err.constructor) {
    case types.StripePreChargeError:
      return handlePreChargeError({ source, user, stringifiedCart, err, studio, returnResponse, employeeid });

    case types.StripeCaptureChargeError:
      return handleCaptureChargeError({ source, user, stringifiedCart, err, studio, returnResponse, employeeid });

    case types.StripeRefundError:
      return handleRefundError({ source, user, stringifiedCart, err, studio, returnResponse, employeeid });

    case types.StripeChargeError:
      return handleChargeError({ source, user, err, studio, returnResponse, employeeid });

    case types.StripeSubscriptionError:
      return handleSubscriptionError({ user, err, studio, returnResponse, employeeid });

    default:
      return handleError({
        opsSubject: 'Stripe Error: Unexpected Error',
        userid: user.id,
        employeeid,
        stringifiedCart,
        returnResponse,
      })(err);
  }
}

module.exports = {
  ...types,
  handleStripeError,
};
