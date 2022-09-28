const moment = require('moment-timezone');
const MailClient = require('@dibs-tech/mail-client');
const { handleError } = require('@dibs-tech/dibs-error-handler');
const Promise = require('bluebird');
const stringify = require('json-stringify-safe');

const mc = new MailClient();

const mcTransactionAsync =
  Promise.promisify(mc.transactions, { context: mc });

/**
 * @param {object} user  user instance
 * @param {object} cart the user checked out with
 * @returns {Promise} resolved promise
 */
module.exports = async function sendBookingSpotsEmail(user, cart) {
  const studio = cart.events.map(item => item.event.studio)[0];
  if (!studio.dibs_config.use_spot_booking) return null;
  try {
    const infoJSON = await Promise.reduce(cart.events, async (acc, item) => {
      const event = await models.event.findById(item.eventid,
        {
          include: [{
            model: models.dibs_studio,
            as: 'studio',
            attributes: [
              'name',
              'mainTZ',
            ],
          },
          {
            model: models.dibs_studio_locations,
            as: 'location',
            attributes: ['name'],
          },
          {
            model: models.dibs_studio_instructors,
            as: 'instructor',
            attributes: ['firstname', 'lastname'],
          }],
          attributes: ['start_date', 'eventid', 'name', 'classid'],
        });
      const spot = await models.spot.findById(item.spotId);
      const emailCartItem = {
        event: {
          eventid: event.eventid,
          name: event.name,
          zfClassId: event.classid,
          location: event.location,
          instructor: event.instructor,
          start_time: moment.tz(moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'), item.event.studio.mainTZ).format('dddd, MMMM Do YYYY, h:mm a'),
        },
        spot: {
          'Dibs Internal Spot ID': spot ? spot.id : 'User did not choose spot',
          'Zingfit Spot ID': spot ? spot.source_id : 'User did not choose spot',
        },
        user: {
          name: user.getFullName(),
          email: user.email,
          id: user.id,
        },
      };
      acc.push(stringify(emailCartItem));
      return acc;
    }, []);
    const body = `User ${user.id} - Has booked Zingfit spots. \n Details: ${infoJSON}`;
    return mcTransactionAsync(`ACTION NEEDED: ${studio.name} SPOT BOOKINGS`, body);
  } catch (err) {
    return handleError({
      opsSubject: 'Spot Email Error',
      opsBody: `Failed to send an email to transactions@ondibs.com after user ${user.id} used spot booking.`,
    })(err);
  }
};
