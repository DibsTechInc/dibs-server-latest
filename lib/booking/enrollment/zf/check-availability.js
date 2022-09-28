const ZingfitClient = require('@dibs-tech/zingfit-client');
const spotCounter = require('./spot-counter');
const _ = require('lodash');
const {
  AvailabilityValidationError,
} = require('../../../errors/booking');


module.exports = async function checkZingfitAvailability(event, quantity) {
  const {
    client_id,
    client_secret,
  } = event.studio;

  const regionId = event.location.region_id;
  const zfc = new ZingfitClient(client_id, client_secret, regionId);
  const spotsResponse = await zfc.getSpots(event.classid);
  const spotsBooked = spotCounter.count(spotsResponse);

  // check that the class has not been hidden
  const clsObj = await zfc.getClasses(event.location.source_location_id).catch((err) => {
    if (err.code === 404) return { classes: [] };
    throw err;
  });
  const classes = _.flatten(clsObj.classes);
  const classIds = classes.map(cls => cls.id);
  if (!classIds.includes(event.classid)) {
    await models.event.update(
      { deleted: 1 },
      { where: { eventid: event.eventid } }
    );
    throw new AvailabilityValidationError(`Event ${event.eventid} is no longer on the schedule`);
  }
  const classResponse = classes.find(c => String(c.id) === String(event.classid));

  if (spotsBooked >= event.seats || classResponse.full) {
    await models.event.update(
      { spots_booked: Math.max(spotsBooked, event.seats) },
      { where: { eventid: event.eventid } }
    );
    throw new AvailabilityValidationError(`Event ${event.eventid} is sold out`);
  }

  if (spotsBooked + quantity >= event.seats) {
    await models.event.update(
      { spots_booked: spotsBooked },
      { where: { eventid: event.eventid } }
    );
    throw new AvailabilityValidationError(`Event ${event.eventid} does not have ${quantity} spots available for purchase`);
  }
};
