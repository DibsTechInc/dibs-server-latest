const ZingfitClient = require('@dibs-tech/zingfit-client');
const Promise = require('bluebird');
const { UnenrollmentError } = require('../../../errors/booking');
const markAttendeeAsDropped = require('../shared/mark-attendee-as-dropped');

const zfUnenrollment = {};
zfUnenrollment.unenrollUserFromZingfitEvents = async ({ user, studio, sales, early }) => {
  try {
    const zfc = new ZingfitClient(studio.client_id, studio.client_secret);
    await Promise.map(sales, async ({ saleId, regionId }) => {
      zfc.regionid = regionId;
      await zfc.unbookSpot(saleId, user.email, !early);
    }, { concurrency: 1 });
    await Promise.map(sales, sale => markAttendeeAsDropped({
      attendeeId: sale.saleId,
      studio,
      early,
    }));
    return;
  } catch (err) {
    throw new UnenrollmentError(err);
  }
};

module.exports = zfUnenrollment;
