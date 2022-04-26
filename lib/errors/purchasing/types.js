const { extendableBuiltin } = require('../../helpers/babel-helpers');

/**
 * @class PurchaseError
 * @extends Error
 */
class PurchaseError extends extendableBuiltin(Error) {
  /**
   * @constructor
   * @constructs PurchaseError
   * @param {string|Error} error message or thrown error by code
   * @param {Array<any>} args additional arguments
   */
  constructor(error) {
    super();
    if (typeof error === 'string') this.message = error;
    else { // this should imply error instanceof Error
      this.message = error.message;
      this.stack = error.stack;
    }
  }
}

/**
 * @class CartPuchaseError
 * @extends PurchaseError
 */
class CartError extends PurchaseError {
  /**
   * @constructor
   * @constructs CartError
   * @param {Error|string} error that caused promo code assocation to fail
   * @param {invalidRecipientEmail} if true, sends message to user to check the email they want to send a gift card to
   * @param {Array<any>} args for constructor
   */
  constructor(error, { invalidRecipientEmail } = {}) {
    if (typeof error === 'string') super(error);
    else { // this should imply error instanceof Error
      super(error.message);
      this.stack = error.stack;
      this.invalidRecipientEmail = invalidRecipientEmail;
    }
  }
}

/**
 * @class PromoCodeAssociationError
 * @extends PurchaseError
 */
class PromoCodeAssociationError extends PurchaseError { }

/**
 * @class EventPriceValidationError
 * @extends PurchaseError
 */
class EventPriceValidationError extends PurchaseError { }

/**
 * @class PackagePriceCalculationError
 * @extends PurchaseError
 */
class PackagePriceCalculationError extends PurchaseError {
  /**
   * @constructor
   * @constructs PackagePriceCalculationError
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation
   */
  constructor(error, { packageid } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    if (packageid) this.packageid = packageid;
  }
}

/**
 * @class FlashCreditAssociationError
 * @extends PurchaseError
 */
class FlashCreditAssociationError extends PurchaseError { }

/**
 * @class PassValidationError
 * @extends PurchaseError
 */
class PassValidationError extends PurchaseError {
  /**
   * @constructor
   * @constructs PassValidationError
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation
   */
  constructor(error, { passid, invalidPass = false } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    if (passid) this.passid = passid;
    this.invalidPass = invalidPass;
  }
}

/**
 * @class CreateTransactionsError
 * @extends PurchaseError
 */
class CreateClassTransactionsError extends PurchaseError { }

/**
 * @class FlashCreditApplicationError
 * @extends PurchaseError
 */
class FlashCreditApplicationError extends PurchaseError {
  /**
   * @constructor
   * @constructs FlashCreditApplicationError
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed to be applied
   */
  constructor(error, { flashCreditId } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    if (flashCreditId) this.flashCreditId = flashCreditId;
  }
}

/**
 * @class PromoCodeApplicationError
 * @extends PurchaseError
 */
class PromoCodeApplicationError extends PurchaseError { }

/**
 * @class PassApplicationError
 * @extends PurchaseError
 */
class PassApplicationError extends PurchaseError {
  /**
   * @constructor
   * @constructs PassApplicationError
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation
   */
  constructor(error, { passid } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    if (passid) this.passid = passid;
  }
}

/**
 * @class CreditApplicationError
 * @extends PurchaseError
 */
class CreditApplicationError extends PurchaseError {
  /**
   * @constructor
   * @constructs CreditApplicationError
   * @param {string} type of credit that was being applied
   * @param {Error|string} error that was thrown
   */
  constructor(type, error) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    this.type = type;
  }
}

/**
 * @class EnrollmentError
 * @extends PurchaseError
 */
class EnrollmentError extends PurchaseError { }

/**
 * @class UpdateSpotCountError
 * @extends PurchaseError
 */
class UpdateSpotCountError extends PurchaseError { }

/**
 * @class RetailError
 * @extends PurchaseError
 */
class RetailError extends PurchaseError { }

/**
 * @class PackagePurchaseError
 * @extends PurchaseError
 */
class PackagePurchaseError extends PurchaseError {
  /**
   * @constructor
   * @constructs PackagePurchaseError
    * @param {Error|string} error thrown or reason for failure
    * @param {Object} opts, can include which pass failed validation
    */
  constructor(error, { firstPurchaseError = false, packageLimitError = false, promoCodeError = false } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    this.firstPurchaseError = firstPurchaseError;
    this.packageLimitError = packageLimitError;
    this.promoCodeError = promoCodeError;
  }
}


/**
 * @class CreditPurchaseError
 * @extends PurchaseError
 */
class CreditPurchaseError extends PurchaseError {
  /**
   * @constructor
   * @constructs CreditPurchaseError
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include id of creditTier
   */
  constructor(error, { creditTierId }) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    this.creditTierId = creditTierId;
  }
}

/**
 * @class WaitlistChargeError
 * @extends PurchaseError
 */
class WaitlistChargeError extends PurchaseError { }

module.exports = {
  PurchaseError,
  CartError,
  PromoCodeAssociationError,
  EventPriceValidationError,
  PackagePriceCalculationError,
  FlashCreditAssociationError,
  PassValidationError,
  CreateClassTransactionsError,
  FlashCreditApplicationError,
  PromoCodeApplicationError,
  PassApplicationError,
  CreditApplicationError,
  EnrollmentError,
  UpdateSpotCountError,
  RetailError,
  PackagePurchaseError,
  WaitlistChargeError,
  CreditPurchaseError,
};
