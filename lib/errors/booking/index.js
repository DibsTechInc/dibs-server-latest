const types = require('./types');
const { handleError } = require('../index');
const handlers = require('./handlers');

/**
 * @param {Object}        args passed to function
 * @param {BookingError}  args.err that was thrown in code
 * @param {Object}        args.user making purchase
 * @param {Object}        args.studio the studio we were checking events out for
 * @param {Array<Object>} args.cart that user was attempting to check out
 * @param {number}        args.eventid that booking failed for
 * @param {Array<string>} args.eventids that booking failed for
 *                                    when the error is thrown
 * @param {boolean}       args.returnResponse for handlers where its supplied: if true
 *                                            the error handler returns a failure response,
 *                                            if false they return null
 * @returns {Object} failure response json
 */
function handleBookingError({
  err,
  user,
  studio,
  cart,
  eventid,
  eventids,
  returnResponse,
  employeeid,
  purchasePlace,
}) {
  switch (err.constructor) {
    case types.AvailabilityValidationError:
      return handlers.handleAvailabilityError({ user, cart, err, studio, returnResponse, employeeid, purchasePlace });

    case types.MaximumEnrollmentError:
      return handlers.handleMaximumEnrollmentError({ user, cart, err, employeeid, returnResponse });

    case types.EnrollmentError:
      return handlers.handleEnrollmentError({ user, studio, err, eventids, returnResponse, employeeid });

    case types.AddToWaitlistError:
      return handlers.handleAddToWaitlistError({ user, err, eventid, employeeid });

    case types.UnenrollmentError:
      return handlers.handleUnenrollmentError({ user, studio, err, eventids, returnResponse, employeeid });

    case types.RemoveFromWaitlistError:
      return handlers.handleRemoveFromWaitlistError({ user, err, eventid, employeeid });
    default:
      return handleError({
        opsSubject: 'Booking Error: Unexpected Error',
        userid: user.id,
        employeeid,
        returnResponse,
      })(err);
  }
}

module.exports = {
  ...types,
  handleBookingError,
};
