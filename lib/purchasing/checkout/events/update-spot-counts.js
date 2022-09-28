const { UpdateSpotCountError } = require('../../../errors/purchasing');
const errorLib = require('../../../errors');
const PricerClient = require('../../../pricer/pricer-client');
const Promise = require('bluebird');

const pc = new PricerClient();

module.exports = async function updateSpotCounts(cart) {
  if (!cart.events.length) return;
  try {
    const eventsWithQuantities = cart.events.reduce((acc, { eventid }) => {
      const foundItem = acc.find(item => item.eventid === eventid);
      if (foundItem) foundItem.quantity += 1;
      else acc.push({ eventid, quantity: 1 });
      return acc;
    }, []);
    await Promise.each(eventsWithQuantities, ({ eventid, quantity }) => models.event.addSpotsBooked(eventid, quantity));
    try {
      await pc.updateStudiosPrice([cart.events[0].event.dibs_studio_id]); // using this one b/c is Promise based
    } catch (err) {
      const eventids = eventsWithQuantities.map(({ eventid }) => eventid).join(', ');
      errorLib.handleError({
        opsSubject: 'Pricing Error: Failed to Reprice After Purchase',
        opsIncludes: `Failed to reprice events ${eventids} at studio ${cart.events[0].event.dibs_studio_id}`,
      })(err);
    }
  } catch (err) {
    throw new UpdateSpotCountError(err);
  }
};
