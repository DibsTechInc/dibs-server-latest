const ZFClient = require('@dibs-tech/zingfit-client');
const { uniq } = require('lodash');

const { Op } = models.Sequelize;

/**
 *
 * @param {object} event instance
 * @param {object} options optioanl params
 * @returns {object} response object
 */
async function roomForDibsAvailableSpots(
  event,
  { useTransactions = false } = {}
) {
  return await models.room.findRoomAsForEvent(
    event.eventid || event.id, { useTransactions });
}

/**
 *
 * @param {object} event instance
 * @returns {object} response object
 */
async function roomForZingfitAvailableSpots(event, { useTransactions = true } = {}) {
  try {
    const { studio, location } = event;
    const dibsTransactions = await models.dibs_transaction.findAll({
      where: {
        eventid: event.eventid || event.id,
        spot_id: { [Op.not]: null },
      },
      include: [
        {
          model: models.dibs_user,
          as: 'user',
          include: [
            {
              model: models.dibs_user_studio,
              as: 'userStudios',
              where: {
                dibs_studio_id: studio.id,
              },
              required: true,
            },
          ],
        },
      ],
    });
    const customerids = uniq(
      dibsTransactions.map(dT => dT.user.userStudios[0].clientid)
    );
    const room =
      await models.room.findRoomAsForEvent(
        event.eventid || event.id, { useTransactions });
    const zfc = new ZFClient(
      studio.client_id,
      studio.client_secret,
      location.region_id
    );

    const spots = await zfc.getSpots(event.classid);
    return room.reconcileDibsAndZingfitSpots(spots, customerids);
  } catch (err) {
    if (err.message.includes('NOT_BOOKABLE')) return roomForDibsAvailableSpots(event, { useTransactions: false });
    throw err;
  }
}

/**
 *
 * @param {object} event event instance
 * @param {object} options optional params
 * @returns {function} proper room data response
 */
function getRoomForAvailableSpots(event, options) {
  return roomForDibsAvailableSpots(event, options);
}

module.exports = getRoomForAvailableSpots;
