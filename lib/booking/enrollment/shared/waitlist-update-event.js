const { handleError } = require('../../../errors');

/**
 * @param {Object} event that needs to be updated
 * @param {Object} payload for update query
 * @returns {Promise<undefined>} updates event in the db
 */
module.exports = async function updateEvent(event, payload) {
  try {
    await models.event.update(
      payload,
      {
        where: { eventid: event.eventid },
      }
    );
  } catch (err) {
    handleError({
      opsSubject: 'Add to Waitlist: Event Refresh Error',
      opsIncludes: `Event ${event.eventid}`,
    })(err);
  }
};
