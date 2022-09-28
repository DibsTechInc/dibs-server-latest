const { Op } = require('sequelize');
// const ZingfitClient = require('@dibs-tech/zingfit-client');
// const spotCounter = require('./spot-counter');
// const { AddToWaitlistError } = require('../../../errors/booking');
// const updateEvent = require('../shared/waitlist-update-event');

module.exports = async function zingfitAddToWaitlist(user, event, pass) {
  // const zfc = new ZingfitClient(event.studio.client_id, event.studio.client_secret, event.location.region_id);

  // switching from zingfit to zoom
  const maxWaitlistId = await models.dibs_transaction.max('waitlist_id',
    { where:
      { waitlist_id: { [Op.ne]: null } } });

  const newWaitlistId = Number(maxWaitlistId) + 1;

  const newWaitListIdStr = newWaitlistId.toString();

  // const response = await zfc.bookWaitlist(event.classid, user.email, pass && pass.source_serviceid);
  // return response.attendanceId;
  return newWaitListIdStr;
};
