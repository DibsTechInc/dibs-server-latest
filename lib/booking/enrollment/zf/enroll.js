const Promise = require('bluebird');
const ZingfitClient = require('@dibs-tech/zingfit-client');
const { EnrollmentError } = require('../../../errors/booking');

async function assignSaleIdAndCreateAttendee({
  dibsTransaction,
  attendeeID,
  user,
  clientid,
  event,
}){
  dibsTransaction.assignSaleId(attendeeID);
  models.attendees.findOrCreate({
    where: {
      attendeeID,
      dibs_studio_id: dibsTransaction.dibs_studio_id,
    },
    defaults: {
      source: 'zf',
      studioID: dibsTransaction.studioid,
      clientID: clientid,
      dropped: false,
      classID: event.classid,
      visitDate: event.start_date,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      userid: user.id,
      eventid: dibsTransaction.eventid,
      spot_id: dibsTransaction.spot_id,
    },
  });
}

/**
 * @param {Object} user instance making purchase
 * @param {Array<Object>} cart object with event & pass we are attempting to book a client into
 * @returns {Promise<undefined>} if the user is successfully enrolled in the events, error otherwise
 */
module.exports = async function enrollUserInZFEvents(user, cart) {
  const {
    client_id,
    client_secret,
  } = cart[0].event.studio;
  const studio = await models.dibs_studio.findOne({
    where: { studioid: cart[0].event.studio.studioid, source: 'zf' },
    include: [{ model: models.dibs_config, as: 'dibs_config' }],
  });
  const userStudio = await models.dibs_user_studio.findOne({
    where:
      { dibs_studio_id: cart[0].event.dibs_studio_id, userid: user.id },
  });
  const zfc = new ZingfitClient(client_id, client_secret, studio.dibs_config.default_region);
  await zfc.activateDibs(user.email, studio.source_dibscode);
  // Enroll in events with ZF pass
  const cartWithZFPass = cart.filter(c => c.pass && c.pass.source_serviceid);
  if (cartWithZFPass.length > 0) {
    await Promise.map(cartWithZFPass, async (c) => {
      zfc.regionid = c.event.location.region_id;
      const response = await zfc.bookSpot(c.event.classid, user.email, c.pass.source_serviceid)
        .catch(async (err) => {
          if (err.body.error === 'CLASS_FULL') {
            try {
              await c.event.update({ spots_booked: event.seats });
            } catch (err) {
              throw new EnrollmentError(err, { sales: cart.map(c => ({ saleId: c.dibsTransaction.saleid })) });
            }
          }
          throw new EnrollmentError(err, { sales: cart.map(c => ({ saleId: c.dibsTransaction.saleid })) });
        });
      await assignSaleIdAndCreateAttendee({
        dibsTransaction: c.dibsTransaction,
        attendeeID: response.attendanceId,
        user,
        clientid: userStudio.clientid,
        event: c.event,
      });
    }, { concurrency: 1 });
  }

  // Enroll in cart with Dibs service
  const cartWithDibsService = cart.filter(c => !c.pass || !c.pass.source_serviceid);
  if (cartWithDibsService.length > 0) {
    await Promise.map(cartWithDibsService, async (c) => {
      zfc.regionid = c.event.location.region_id;
      const response = await zfc.bookSpot(c.event.classid, user.email)
        .catch(async (err) => {
          if (err.body.error === 'CLASS_FULL') {
            try {
              await c.event.update({ spots_booked: c.event.seats });
            } catch (err) {
              throw new EnrollmentError(err, { sales: cart.map(c => ({ saleId: c.dibsTransaction.saleid })) });
            }
          }
          throw new EnrollmentError(err, { sales: cart.map(c => ({ saleId: c.dibsTransaction.saleid })) });
        });
      await assignSaleIdAndCreateAttendee({
        dibsTransaction: c.dibsTransaction,
        attendeeID: response.attendanceId,
        user,
        clientid: userStudio.clientid,
        event: c.event,
      });
    }, { concurrency: 1 });
  }
  return null;
};
