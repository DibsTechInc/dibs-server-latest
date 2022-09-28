const { handleError } = require('../../../errors');

/**
 * markAttendeeAsDropped
 * @param {String} clientid clientid to mark attendee as dropped
 * @param {Object} event event to mark attendee as dropped
 * @param {Object} studio studio where the event was dropped
 * @param {String} attendeeId attendee id to drop
 * @returns {Promise<undefined>} updates attendee in the db
 */
module.exports = async function markAttendeeAsDropped({
  studio,
  attendeeId = null,
  early = true,
}) {
  try {
    return models.attendees.update(
      { dropped: true, early_cancel: early },
      {
        where: {
          attendeeID: attendeeId,
          dibs_studio_id: studio.id,
          dropped: false,
        },
      }
    );
  } catch (err) {
    return handleError({
      opsSubject: 'Unenroll: Mark Attendee Dropped Error',
      opsIncludes: `Attendee id ${attendeeId}. Studio ${studio.id}`,
    })(err);
  }
};
