const moment = require('moment-timezone');
const { groupBy } = require('lodash');
const checkMindbodyAvailability = require('./mb/check-availability');
const checkPike13Availability = require('./pt/check-availability');
// const checkZingfitAvailability = require('./zf/check-availability');
const checkDibsAvailability = require('./dibs/check-availability');
const enrollUserInMindbodyEvents = require('./mb/enroll');
const enrollUserInPike13Events = require('./pt/enroll');
const enrollUserInZingfitEvents = require('./zf/enroll');
const addToMindbodyWaitlist = require('./mb/add-to-waitlist');
const checkMindbodyWaitlist = require('./mb/check-waitlist');
const addToZingfitWaitlist = require('./zf/add-to-watilist');
const checkZingfitWaitlist = require('./zf/check-waitlist');
const updateZFAttendance = require('./zf/update-attendance');
const {
  EnrollmentError,
  AddToWaitlistError,
  AvailabilityValidationError,
  MaximumEnrollmentError,
} = require('../../errors/booking');

/**
 * @param {Object} user instance making purchase
 * @param {string} clientid associated to the user
 * @param {number} employeeid of employee checking out on user's behalf
 * @param {Object} event instance for purchase
 * @param {number} quantity the user wants to enroll
 * @returns {Promise<undefined>} resolves if the class is available, otherwise throws error
 */
async function checkAvailabilityForBookingEvent(user, clientid, employeeid, { event, quantity }) {
  if (moment(event.start_time) < moment().tz(event.studio.mainTZ).startOf('day')) {
    throw new Error(`Event ${event.eventid} is no longer available; booking closes ten minutes prior to class start time.`);
  }
  switch (event.source) {
    case 'mb':
      await checkMindbodyAvailability({
        user,
        clientid,
        event,
        quantity,
        employeeid,
      });
      return;
    case 'pt':
      await checkPike13Availability(event, quantity);
      return;
    case 'zf':
      // await checkZingfitAvailability(event, quantity);
      return;
    default:
      throw new Error(`Event ${event.eventid} does not have a valid source`);
  }
}
/**
 * @param {Object} user instance making purchase
 * @param {number} employeeid of employee checking out on user's behalf
 * @param {Object} event instance for purchase
 * @param {number} quantity the user wants to enroll
 * @returns {Promise<undefined>} resolves if the class is available, otherwise throws error
 */
async function checkDibsAvailabilityForBookingEvent(user, employeeid, { event, quantity }) {
  // if (moment(event.start_time) < moment().tz(event.studio.mainTZ).startOf('day')) {
  //   throw new Error(`Event ${event.eventid} is no longer available; booking closes ten minutes prior to class start time.`);
  // }
  // console.log(`user = ${JSON.stringify(user)}`);
  console.log(`employeeid: ${JSON.stringify(employeeid)}`);
  switch (event.source) {
    case 'zf':
      await checkDibsAvailability(event, quantity);
      return;
    default:
      throw new Error(`Event ${event.eventid} does not have a valid source`);
  }
}

/**
 * @param {Object} user instance making purchase
 * @param {Array<Object>} events in which the user wants to enroll
 * @param {Array<Object>} studioCart cart used for transaction mapping
 * @param {Object} userStudio instance making purchase
 * @returns {Promise<undefined>} resolves if the user is successfully enrolled, else throws error
 */
function enrollUserInEvents(user, events, studioCart, userStudio) {
  switch (events[0].event.source) {
    case 'mb':
      return enrollUserInMindbodyEvents(user, events, userStudio);
    case 'pt':
      return enrollUserInPike13Events(user, events);
    case 'zf':
      return enrollUserInZingfitEvents(user, studioCart);
    default:
      throw new Error(`Event ${events[0].event.eventid} does not have a valid source for user enrollment`);
  }
}

module.exports = {
  /**
   * @param {Object} user instance making purchase
   * @param {string} clientid associated to the user
   * @param {number} employeeid of employee checking out on user's behalf
   * @param {Object} event instance for purchase
   * @param {number} quantity the user wants to enroll
   * @returns {Promise<undefined>} resolves if the class is available, otherwise throws error
   */
  async checkEventAvailability(user, clientid, employeeid, { event, quantity }) {
    return checkAvailabilityForBookingEvent(user, clientid, employeeid, { event, quantity });
  },
  /**
   * @param {Object} user instance making purchase
   * @param {Object} event instance to enroll in
   * @param {Object} userStudio instance making purchase
   * @returns {Promise<undefined>} resolves if the user is successfully enrolled in event
   */
  async enrollUserInEvent(user, event, userStudio) {
    try {
      const result = await enrollUserInEvents(user, [{ event }], null, userStudio);
      return result;
    } catch (err) {
      if (err instanceof EnrollmentError) throw err;
      throw new EnrollmentError(err);
    }
  },

  updateAttendance(user, studio) {
    // Non-blocking, asynchronous run
    if (studio.source === 'zf') return updateZFAttendance(user, studio);
    return null;
  },
  /**
   * @param {Object} user instance making purchase
   * @param {string} clientid associated to the user on the booking platform
   * @param {Array<Object>} eventItems in cart
   *                        they need to have events associated to them
   *                        also should only have events at 1 studio
   * @param {number} employeeid of employee making purchase
   * @returns {Promise<undefined>} resolves if items in the cart are bookable
   */
  async validateCartAvailability({
    user,
    clientid,
    eventItems,
    employeeid,
  }) {
    try {
      const eventsInCart = eventItems.reduce((acc, { event, eventid }) => {
        const existingItem = acc.find(item => item.eventid === eventid);
        if (existingItem) existingItem.quantity += 1;
        else acc.push({ eventid, quantity: 1, event });
        return acc;
      }, []);
      await Promise.map(eventsInCart, checkAvailabilityForBookingEvent.bind(null, user, clientid, employeeid));
    } catch (err) {
      if (
        err instanceof AvailabilityValidationError
        || err instanceof MaximumEnrollmentError
      ) throw err;
      throw new AvailabilityValidationError(err);
    }
  },
  /**
   * @param {Object} user instance making purchase
   * @param {Array<Object>} eventItems in cart
   *                        they need to have events associated to them
   *                        also should only have events at 1 studio
   * @param {number} employeeid of employee making purchase
   * @returns {Promise<undefined>} resolves if items in the cart are bookable
   */
  async validateDibsCartAvailability({
    user,
    eventItems,
    employeeid,
  }) {
    try {
      const eventsInCart = eventItems.reduce((acc, { event, eventid }) => {
        const existingItem = acc.find(item => item.eventid === eventid);
        if (existingItem) existingItem.quantity += 1;
        else acc.push({ eventid, quantity: 1, event });
        return acc;
      }, []);
      await Promise.map(eventsInCart, checkDibsAvailabilityForBookingEvent.bind(null, user, employeeid));
    } catch (err) {
      if (
        err instanceof AvailabilityValidationError
        || err instanceof MaximumEnrollmentError
      ) throw err;
      throw new AvailabilityValidationError(err);
    }
  },
  /**
   * @param {Object} user instance making purchase
   * @param {Array<Object>} studioEventCart cart
   *                        they need to have events associated to them
   *                        also should only have events at 1 studio
   * @returns {Promise<undefined>} resolves if the user is successfully enrolled in events
   */
  async enrollUserInCartEvents(user, studioEventCart) {
    try {
      const events = studioEventCart.map(item => ({ event: item.event, unpaid: item.unpaid, pass: item.pass }));
      const result = await enrollUserInEvents(user, events, studioEventCart);
      return result;
    } catch (err) {
      if (err instanceof EnrollmentError) throw err;
      throw new EnrollmentError(err);
    }
  },


  /**
   * @param {Object} user being added to the waitlist
   * @param {Object} event instance, the class they want to attend
   * @param {Object} pass instance to use for the class (optional)
   * @returns {Promise<undefined>} adds them to the mindbody waitlist, errors otherwise
   */
  async addToWaitlist(user, event, pass) {
    switch (event.source) {
      case 'mb':
        return addToMindbodyWaitlist(user, event, pass);
      case 'zf':
        return addToZingfitWaitlist(user, event, pass);
      default:
        throw new AddToWaitlistError(`Event ${event.eventid} does not have a valid source for waitlisting`);
    }
  },

  /**
   * @param {Array<Object>} waitlistTransactions queried by the cron
   * @returns {Object} containing transactions where users got off the waitlist (fulfilled) and the rest (unfulfilled)
   */
  async checkWaitlist(waitlistTransactions) {
    const transactionsBySource = groupBy(waitlistTransactions, 'source');
    const fulfilledTransactions = [];
    const unfulfilledTransactions = [];

    const {
      fulfilledTransactions: fulfilledMBTransactions,
      unfulfilledTransactions: unfulfilledMBTransactions,
    } = await checkMindbodyWaitlist(transactionsBySource.mb);
    fulfilledTransactions.push(...fulfilledMBTransactions);
    unfulfilledTransactions.push(...unfulfilledMBTransactions);

    const {
      fulfilledTransactions: fulfilledZFTransactions,
      unfulfilledTransactions: unfulfilledZFTransactions,
    } = await checkZingfitWaitlist(transactionsBySource.zf);
    fulfilledTransactions.push(...fulfilledZFTransactions);
    unfulfilledTransactions.push(...unfulfilledZFTransactions);

    const unsuccessfulTransactions = unfulfilledTransactions.filter(
      ({ event, dibs_studio: studio }) =>
        moment.tz(
                moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'),
                studio.mainTZ
              ).isBefore(moment().subtract(20, 'minutes'))
    );

    return {
      fulfilledTransactions, // people who got off the waitlist
      unsuccessfulTransactions, // people who did not get off the waitlist and class happened
    };
  },
};
