const Pike13Client = require('@dibs-tech/pike13-client');

module.exports = async function checkPike13Availability(event, quantity) {
  const ptc = new Pike13Client(event.studio.client_token, event.studio.domain);
  const { event_occurrences: [response] } = await ptc.getClass(event.classid);

  if (response.capacity_remaining < 1) {
    await models.event.update(
      { spots_booked: response.visits_count },
      { where: { eventid: event.eventid } }
    );
    throw new Error(`Event ${event.eventid} is sold out`);
  }

  if (response.capacity_remaining - quantity < 1) {
    await models.event.update(
      { spots_booked: response.visits_count },
      { where: { eventid: event.eventid } }
    );
    throw new Error(`Event ${event.eventid} does not have ${quantity} spots available for purchase`);
  }
};
