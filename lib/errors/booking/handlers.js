const { handleError } = require('../index');
const stringifyCart = require('../../purchasing/checkout/helpers/stringify-cart');
const { uniq } = require('lodash');
const { getPronounForErrorMsg } = require('../helpers/error-message-helper');

const SOURCES = { mb: 'Mindbody', pt: 'Pike 13' };

module.exports = {
  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<Object>} args.cart being purchased
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @param {number}        args.employeeid id of employee acting on users behalf
   * @returns {Object} failure response json
   */
  handleAvailabilityError({ user, cart, err, studio, returnResponse = false, employeeid, purchasePlace }) {
    const eventids = uniq(cart.map(({ eventid }) => eventid));
    let responseMessage;
    switch (true) {
      case err.soldOut:
        responseMessage = eventids.length > 1 ?
          'Oh no! One of those class is now sold out. Please refresh and try again.'
          : 'Sorry! This class is sold out. Please select another.';
        break;
      case err.canceled:
        responseMessage = eventids.length > 1 ?
          'Oh no! One of these classes was just cancelled. Please refresh and try again.'
          : 'Oh no! This class was just cancelled from the schedule. Please select another.';
        break;
      case err.spotsUnavailable:
        responseMessage = eventids.length > 1 ?
          `Unfortunately, in one of those classes there are not enough spots to complete ${getPronounForErrorMsg('your', user, employeeid)} group booking. Please reduce the number of spots and try again.`
          : `Unfortunately, there are not enough spots available to complete ${getPronounForErrorMsg('your', user, employeeid)} group booking. Please reduce the number of spots and try again.`;
        break;
      default:
        responseMessage = eventids.length > 1 ?
          `Oh no! It appears that some of the classes in ${getPronounForErrorMsg('your', user, employeeid)} cart are no longer available for purchase.`
          : 'Oh no! It appears that class is no longer available for purchase.';
    }

    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      employeeid,
      opsSubject: 'Purchase Error: Class Availability Error',
      opsBody: `A user's cart had classes ${studio ? `at studio ${studio.id}` : ''}that were no longer available for purchase. User was purchasing on ${purchasePlace}`,
    })(err);
    if (!studio || returnResponse) return apiFailureWrapper({}, responseMessage);
    return null;
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {PurchaseError} args.err that was thrown in code
   * @param {Array<Object>} args.cart being purchased
   * @param {boolean}       args.returnResponse if true fn returns an apiFailureResponse JSON
   * @param {number}        args.employeeid id of employee acting on users behalf
   * @returns {Object} failure response json
   */
  handleMaximumEnrollmentError({ user, err, cart, returnResponse, employeeid }) {
    const stringifiedCart = stringifyCart(cart);
    handleError({
      stringifiedCart,
      userid: user.id,
      opsSubject: 'Purchase Error: Maximum Enrollment Limit',
      opsIncludes: `Event ${err.eventid} and ClientID ${err.clientid}`,
      employeeid,
    })(err);
    if (returnResponse) {
      return apiFailureWrapper(
        {}, 'Oops! Looks like you’re over the spot limit for a class in your cart.');
    }
    return null;
  },

  /**
   * @param {Object} args argument object
   * @param {Object} args.user instance who tried to go on the waitlist
   * @param {Object} args.dibsTransaction waitlist transaction instance
   * @param {Error} args.err the error
   * @param {number} args.employeeid id of employee acting on users behalf
   * @returns {Object} API failure response
   */
  handleRemoveFromWaitlistError({ user, err, eventid, employeeid }) {
    handleError({
      opsSubject: 'Remove From Waitlist Error: Booking',
      opsIncludes: `Waitlist for event ${eventid}`,
      userid: user.id,
      employeeid,
    })(err);
    return apiFailureWrapper({}, 'Sorry, something went wrong removing you from the waitlist.');
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<string>} args.eventids that enrollment failed for
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @returns {Object} failure response json
   */
  handleEnrollmentError({ user, eventids, err, studio, returnResponse = false, employeeid }) {
    let responseMessage;
    switch (true) {
      case err.mbVisitRestriction:
        responseMessage = 'Sorry, something went wrong enrolling you in class. Looks like you’ve hit your daily limit for this pass!';
        break;
      default:
        responseMessage = `Sorry, something went wrong enrolling ${getPronounForErrorMsg('you', user, employeeid)} into ${getPronounForErrorMsg('your', user, employeeid)} classes.`;
    }
    handleError({
      userid: user.id,
      employeeid,
      opsSubject: `Booking Error: ${SOURCES[studio.source]} Enrollment Error`,
      opsBody: `Something went wrong enrolling user ${user.id} in ${SOURCES[studio.source]} events ${eventids ? eventids.join(', ') : 'N/A'} while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, responseMessage);
    return null;
  },

  /**
   * @param {Object} args argument object
   * @param {Object} args.user instance who tried to go on the waitlist
   * @param {number} args.eventid for the class
   * @param {Error} args.err the error
   * @param {number} args.employeeid id of employee acting on users behalf
   * @returns {Object} API failure response
   */
  handleAddToWaitlistError({ user, eventid, err, employeeid }) {
    let responseMessage;
    let refreshEvent = false;
    switch (true) {
      case err.alreadyEnrolled:
        responseMessage = 'Sorry, you cannot add yourself to the waitlist for a class you are already enrolled in.';
        break;
      case err.waitlistUnavailable:
        refreshEvent = true;
        responseMessage = 'Oh no, it appears that the waitlist for this class is no longer available.';
        break;
      case err.eventNoLongerFull:
        refreshEvent = true;
        responseMessage = 'It looks like that class is no longer full, feel free to purchase a spot.';
        break;
      default:
        responseMessage = 'Oh no, something went wrong adding you to the waitlist for that class.';
    }
    handleError({
      opsSubject: 'Add To Waitlist Error: Booking',
      userid: user.id,
      opsIncludes: `Event ${eventid}`,
      employeeid,
    })(err);
    return apiFailureWrapper({ refreshEvent }, responseMessage);
  },

  /**
   * @param {Object}        args passed to function
   * @param {Object}        args.user making purchase
   * @param {Array<string>} args.eventids that enrollment failed for
   * @param {PurchaseError} args.err that was thrown in code
   * @param {number}        args.studio the studio we were checking events out for
   *                                    when the error is thrown
   * @returns {Object} failure response json
   */
  handleUnenrollmentError({ user, eventids, err, studio, returnResponse = false, employeeid }) {
    let responseMessage;
    switch (true) {
      case err.attendanceNotCancellable:
        responseMessage = err.message;
        break;
      default:
        responseMessage = `Sorry, something went wrong dropping ${getPronounForErrorMsg('you', user, employeeid)} from ${getPronounForErrorMsg('your', user, employeeid)} classes.`;
    }
    handleError({
      userid: user.id,
      employeeid,
      opsSubject: `Booking Error: ${SOURCES[studio.source]} Unenrollment Error`,
      opsBody: `Something went wrong unenrolling user ${user.id} in ${SOURCES[studio.source]} events ${eventids ? eventids.join(', ') : 'N/A'} while making a class purchase at studio ${studio.id}.`,
    })(err);
    if (returnResponse) return apiFailureWrapper({}, responseMessage);
    return null;
  },
};
