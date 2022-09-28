const Pike13Client = require('@dibs-tech/pike13-client');

/**
 * @param {Object} user instance making purchase
 * @param {Array<Object>} events object with event & pass we are attempting to book a client into
 * @returns {Promise<undefined>} if the user is successfully enrolled in the events, error otherwise
 */
module.exports = async function enrollUserInPike13Events(user, events) {
  const pike13Client = new Pike13Client(events[0].event.client_token, events[0].event.domain);

  const userStudio = await models.dibs_user_studio.findOne({
    where:
      { dibs_studio_id: events[0].event.dibs_studio_id, userid: user.id },
  });
  if (!userStudio.clientid) throw new Error('User must have a Pike13 clientid to enroll in a class');

  events.forEach(e => pike13Client.enroll(userStudio.clientid, e.event.eventid));
};
