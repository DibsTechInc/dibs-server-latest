const MBClient = require('@dibs-tech/mindbody-client');
const Promise = require('bluebird');
const singleClassAttendeeUpdater = require('../../../publishers/single-class-attendee-updater');
const MailClient = require('@dibs-tech/mail-client');
const { AvailabilityValidationError, MaximumEnrollmentError } = require('../../../errors/booking');
const resolveNestedObj = require('../../../helpers/resolve-nested-object');

const mc = new MailClient();

/**
 * @param {Object} user instance making purchase
 * @param {string} clientid user's mindbody clientid
 * @param {Object} event instance we are attempting to book a client into
 * @param {number} quantity of spots the client wants
 * @param {number} employeeid of employee making checkout on user's behalf
 * @returns {Promise<undefined>} if the class is available it resolves
 */
module.exports = async function checkMindbodyAvailability({
  user,
  clientid,
  event,
  quantity,
  employeeid,
}) {
  const { studio } = event;
  const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, event.studioid);
  const getCompleteClassDataAsync = Promise.promisify(mbc.getCompleteClassData, { context: mbc });
  const result = await getCompleteClassDataAsync(event.classid);

  if (result === null || result.GetClassVisitsResult.ErrorCode === 306) {
    await models.event.update(
      {
        canceled: 1,
        deleted: result ? 0 : 1,
      },
      { where: { eventid: event.eventid } }
    );
    throw new AvailabilityValidationError(
      `Event ${event.eventid} was canceled`, { canceled: true });
  }

  // call singleClassAttendeeUpdater w empty array if visits not on response
  // so that we can drop users from class if needed
  const visits = resolveNestedObj(
    result, 'GetClassVisitsResult', 'Class', 'Visits', 'Visit');
  singleClassAttendeeUpdater.publish(event.eventid, event.dibs_studio_id, visits);

  if (result.GetClassVisitsResult.Class.TotalBooked >= result.GetClassVisitsResult.Class.WebCapacity) {
    await models.event.update(
      { spots_booked: result.GetClassVisitsResult.Class.TotalBooked },
      { where: { eventid: event.eventid } }
    );
    throw new AvailabilityValidationError(
      `Event ${event.eventid} is sold out`, { soldOut: true });
  }

  if (result.GetClassVisitsResult.Class.TotalBooked + quantity > result.GetClassVisitsResult.Class.WebCapacity) {
    await models.event.update(
      { spots_booked: result.GetClassVisitsResult.Class.TotalBooked },
      { where: { eventid: event.eventid } }
    );
    throw new AvailabilityValidationError(
      `Event ${event.eventid} does not have ${quantity} spots available for purchase`, { spotsUnavailable: true });
  }

  const maxEnrollmentSetting = studio.dibs_config.maximum_allowed_client_enrollment;
  if (!employeeid && maxEnrollmentSetting) {
    const clientVisitCount = Number(visits && visits.filter(
      v => resolveNestedObj(v, 'Client', 'ID') === clientid
    ).length);
    if (clientVisitCount + quantity > maxEnrollmentSetting) {
      throw new MaximumEnrollmentError(
        `User ${user.id} cannot book ${quantity} spots in event ${event.eventid} without going over the maximum allowed client enrollment.\n`
        + `Dibs config setting: ${maxEnrollmentSetting}\n`);
    }
  }

  const potentialDoubleBooking = visits && visits.find(
    v => (resolveNestedObj(v, 'Client', 'Email') || '').toLowerCase() === user.email);
  if (potentialDoubleBooking) {
    mc.ops(
      'Potential Duplicate Booking',
      `User ${user.id} is booking a class which they already appear in. Event ID: ${event.eventid} Visit data: ${potentialDoubleBooking}.`);
  }
};
