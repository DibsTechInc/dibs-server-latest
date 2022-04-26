const types = require('./types');
const {
  handleCartError,
  handlePromoCodeAssociationError,
  handleEventPriceValidationError,
  handlePackagePriceCalculationError,
  handleFlashCreditAssociationError,
  handleCreateTransactionsError,
  handlePassValidationError,
  handleFlashCreditApplicationError,
  handlePromoCodeApplicationError,
  handlePassApplicationError,
  handleCreditApplicationError,
  handleUpdateSpotCountError,
  handlePackagePurchaseError,
  handleWaitlistChargeError,
  handleCreditPurchaseError,
  stringifyCart,
} = require('./handlers');
const { handleError } = require('../index');

/**
 * @param {Object}        args passed to function
 * @param {Object}        args.user making purchase
 * @param {Array<Object>} args.cart being purchased
 * @param {Object}        args.promoCode applied to purchase
 * @param {PurchaseError} args.err that was thrown in code
 * @param {number}        args.dibsStudioId the studio we were checking events out for
 *                                          when the error is thrown
 * @param {Object}        args.studio the studio where the classes being purchased are
 * @param {Object}        args.waitlistTransaction for waitlist charge errors
 * @returns {Object} failure response json
 */
function handlePurchaseError({
  user,
  cart,
  promoCode,
  err,
  studio,
  returnResponse,
  waitlistTransaction,
  employeeid,
  purchasePlace,
}) {
  const stringifiedCart = cart && stringifyCart(cart);
  switch (err.constructor) {
    case types.CartError:
      return handleCartError({ user, cart, err, employeeid });

    case types.PromoCodeAssociationError:
      return handlePromoCodeAssociationError({ user, cart, promoCode, err, employeeid });

    case types.EventPriceValidationError:
      return handleEventPriceValidationError({ user, cart, err, studio, returnResponse, employeeid, purchasePlace });

    case types.PackagePriceCalculationError:
      return handlePackagePriceCalculationError({ user, cart, err, studio, returnResponse, employeeid });

    case types.FlashCreditAssociationError:
      return handleFlashCreditAssociationError({ user, cart, err, studio, returnResponse, employeeid });

    case types.PassValidationError:
      return handlePassValidationError({ user, cart, err, studio, returnResponse, employeeid });

    case types.CreateClassTransactionsError:
      return handleCreateTransactionsError({ user, cart, err, studio, returnResponse, employeeid });

    case types.FlashCreditApplicationError:
      return handleFlashCreditApplicationError({ user, cart, err, studio, returnResponse, employeeid });

    case types.PromoCodeApplicationError:
      return handlePromoCodeApplicationError(user, cart, err, employeeid);

    case types.PassApplicationError:
      return handlePassApplicationError({ user, cart, err, studio, returnResponse, employeeid });

    case types.CreditApplicationError:
      return handleCreditApplicationError({ user, cart, err, studio, returnResponse, employeeid });

    case types.UpdateSpotCountError:
      return handleUpdateSpotCountError({ user, cart, err, studio, returnResponse, employeeid });

    case types.PackagePurchaseError:
      return handlePackagePurchaseError({ user, err, studio, returnResponse, employeeid });

    case types.CreditPurchaseError:
      return handleCreditPurchaseError({ user, cart, err, returnResponse, employeeid });

    case types.WaitlistChargeError:
      return handleWaitlistChargeError({ waitlistTransaction, err });

    default:
      return handleError({
        opsSubject: 'Purchase Error: Unexpected Error',
        userid: user.id,
        employeeid,
        stringifiedCart,
        returnResponse,
        resMessage: 'Sorry, something went wrong checking out your cart.',
      })(err);
  }
}

module.exports = {
  ...types,
  handlePurchaseError,
};
