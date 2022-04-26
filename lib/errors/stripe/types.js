const Enum = require('enum');
const { extendableBuiltin } = require('../../helpers/babel-helpers');

const StripeErrorSources = new Enum([
  'ClassPurchase',
  'CreditPurchase',
  'PackagePurchase',
  'RetailPurchase',
  'Checkout',
  'Drop',
]);

/**
 * @class StripeError
 * @extends Error
 */
class StripeError extends extendableBuiltin(Error) {
  /**
   * @constructor
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which charge we failed to capture
   */
  constructor(error, { chargeId } = {}) {
    super();
    if (typeof error === 'string') this.message = error;
    else { // this should imply error instanceof Error
      this.message = error.message;
      this.stack = error.stack;
    }
    this.chargeId = chargeId;
  }
}

/**
 * @class StripePreChargeError
 * @extends StripeError
 */
class StripePreChargeError extends StripeError { }

/**
 * @class StripeChargeError
 * @extends StripeError
 */
class StripeChargeError extends StripeError { }


/**
 * @class StripePreChargeError
 * @extends StripeError
 */
class StripeCaptureChargeError extends StripeError { }

/**
 * @class StripeRefundError
 * @extends StripeError
 */
class StripeRefundError extends StripeError { }

/**
 * @class StripeSubscriptionError
 * @extends StripeError
 */
class StripeSubscriptionError extends StripeError {
  /**
   * @constructor
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which charge we failed to capture
   */
  constructor(error, { forUnsubscribe = false } = {}) {
    if (typeof error === 'string') super(error);
    else super(error.message);
    this.forUnsubscribe = forUnsubscribe;
  }
}

module.exports = {
  StripeErrorSources,
  StripeError,
  StripePreChargeError,
  StripeCaptureChargeError,
  StripeChargeError,
  StripeRefundError,
  StripeSubscriptionError,
};
