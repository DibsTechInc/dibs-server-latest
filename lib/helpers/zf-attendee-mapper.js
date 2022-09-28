const Promise = require('bluebird');
const moment = require('moment-timezone');
const ZingfitClient = require('@dibs-tech/zingfit-client');
const MailClient = require('@dibs-tech/mail-client');
const { isEmpty } = require('lodash');
const { Op } = require('sequelize');
const errorHelper = require('../errors');

const mc = new MailClient();

/**
 * getSpotId
 * @param {Number} dibsTransactionSpotId    spot id on the dibs transaction--used for onsite bookings
 * @param {String} zfAttendeeSpotLabel      zf spot label on the attendee from zf
 * @param {Array<Number>} takenSpotIds      spot ids taken by dibs/zf users based on dibs spot map
 * @param {Array<Object>} spotsInRoom       all spot objects in the room
 * @returns {Number} spotId                 spot id to put the user in
 */
function getSpotId({
  dibsTransactionSpotId,
  zfAttendeeSpotLabel,
  takenSpotIds,
  spotsInRoom,
}) {
  if (dibsTransactionSpotId) return dibsTransactionSpotId;
  let zfAssessedSpot = (spotsInRoom[zfAttendeeSpotLabel] &&
                        spotsInRoom[zfAttendeeSpotLabel].id) ||
                       null;
  if (takenSpotIds[zfAssessedSpot]) {
    const spotIdsInRoom = Object.values(spotsInRoom).map(s => s.id);
    const nextAvailableSpot = spotIdsInRoom.find(spot => !takenSpotIds[spot]);
    zfAssessedSpot = nextAvailableSpot;
  }
  takenSpotIds[zfAssessedSpot] = true;
  return zfAssessedSpot;
}

/**
 * @param {Object} droppedAttendee                        dropped attendee objects
 * @param {Number} dibsStudioId                           studio id
 * @returns {Promise<Object>} resolved promise response
 */
async function offsiteDropOffsiteZFTransactions(droppedAttendee, dibsStudioId) {
  const transaction = await models.dibs_transaction.findOne({
    where: {
      saleid: String(droppedAttendee.attendeeID),
      dibs_studio_id: dibsStudioId,
      userid: droppedAttendee.userid,
    },
  });
  if (transaction && transaction.purchasePlace === 'offsite') {
    transaction.description += ' | Beginning Offsite Drop';
    transaction.drop_source = 'offsit';
    transaction.description += ' | User booked offsite, ignoring offsite drop processing';
    return transaction.destroy();
  }
}

module.exports = {
  async getZFUserClasses(user, studio) {
    const zfc = new ZingfitClient(studio.client_id, studio.client_secret, studio.dibs_config.default_region);
    return await zfc.getUserClasses(user.email, { pageLimit: 1, size: 25 }).catch((err) => {
      if (err.body.error_description === 'Bad credentials') {
        mc.ops(
          'ZF Bad Credentials',
          `User ${user.id} - ${user.email} had an invalid response from Zingfit for studio ${studio.id}.`
          + 'Please confirm the account exists'
        );
        return null;
      }
      throw err;
    });
  },

  /**
   *
   * @param {Object} args  params (can be brought in or will be created)
   * @param {Object} args.user  instance
   * @param {Object} args.studio studio with dibs_config
   * @param {Array<Object>} args.events array of event instances (only classid and eventid are needed)
   * @param {Array<Object>} args.rooms  array of rooms with spots
   * @param {Array<Object>} args.zfattendance getUserClasses response from ZF
   * @param {Object} args.userStudio users user studio info
   * @param {Array<Number>} args.takenSpotIds spot ids taken in the class
   * @returns {Array} updated attendee data
   */
  async mapZFAttendance({
    user,
    studio,
    events,
    rooms,
    userStudio = null,
    classid = null,
    zfattendance,
    bookableSpotsInRoom = {},
    takenSpotIds = {},
    dibsTransactions = null,
  }) {
    try {
      userStudio = userStudio || await models.dibs_user_studio.findOne({ where: { userid: user.id, dibs_studio_id: studio.id } });
      // if all transactions for the user for the event have spots and no drops do not need to refresh
      // means we already pulled them in from ZF and assigned them to a proper spot
      const transactionsWithSpots = dibsTransactions && dibsTransactions.filter(
        t => t.spot_id &&
        t.purchasePlace === models.dibs_transaction.PurchasePlaces.OFFSITE
      );
      if (dibsTransactions && (dibsTransactions.length > 0 && transactionsWithSpots.length === dibsTransactions.length) &&
          zfattendance.filter(zfa => zfa.status !== 'Enrolled' && zfa.classId === classid).length === 0) return userStudio.clientid;
      if (!zfattendance) return userStudio.clientid;
      if (classid) {
        const enrolledAttendanceInClass = zfattendance.filter(a => a.classId === classid);
        if (!enrolledAttendanceInClass) return userStudio.clientid;

        // reduce size to all enrollments in current class + 1 additional enrollment to test for new user
        zfattendance = zfattendance.reduce((acc, val) => {
          if (val.classId === classid || acc.length > enrolledAttendanceInClass.length) return acc;
          if (val.status === 'Enrolled') {
            acc.push(val);
          }
          return acc;
        }, enrolledAttendanceInClass);
      }
      const classIdMappedEventIds = events.reduce((acc, event) => {
        acc[event.classid] = event.eventid;
        return acc;
      }, {});

      if (!dibsTransactions) {
        dibsTransactions = await models.dibs_transaction.findAll({
          where: {
            userid: user.id,
            eventid: events.map(e => e.eventid),
            status: 1,
          },
        });
      }
      const dibsTransactionSpotMap = dibsTransactions.reduce((acc, val) => {
        acc[val.saleid] = val.spot_id;
        return acc;
      }, {});

      const sourceMappedRooms = rooms.reduce((acc, room) => {
        acc[room.source_roomid] = room;
        return acc;
      }, {});
      await Promise.map(zfattendance, async (zfattendee) => {
        let spotId;
        if (zfattendee.classId === classid) {
          spotId = getSpotId({
            dibsTransactionSpotId: dibsTransactionSpotMap[zfattendee.attendanceId],
            takenSpotIds,
            spotsInRoom: bookableSpotsInRoom ||
              (sourceMappedRooms[zfattendee.roomId] &&
              sourceMappedRooms[zfattendee.roomId].sourceIdMappedSpots),
            zfAttendeeSpotLabel: zfattendee.spotLabel,
          });
        }
        const eventid = classIdMappedEventIds[zfattendee.classId];
        const [attendee] = await models.attendees.findOrInitialize({
          where: {
            attendeeID: zfattendee.attendanceId,
            dibs_studio_id: studio.id,
          },
          defaults: {
            source: 'zf',
            studioID: studio.studioid,
            classID: zfattendee.classId,
            clientID: userStudio.clientid,
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
            checkedin: Boolean(
              zfattendee.status === 'Enrolled' && moment().isAfter(moment.tz(zfattendee.classDate, studio.mainTZ))
            ),
            visitDate: moment(zfattendee.classDate)
              .utc()
              .format('YYYY-MM-DD HH:mm:ss')
              .toString(),
            dropped: zfattendee.status !== 'Enrolled',
            userid: user.id,
            eventid,
            spot_id: spotId,
          },
        });
        attendee.email = user.email;
        attendee.firstname = user.firstName;
        attendee.lastname = user.lastName;
        attendee.dropped = zfattendee.status !== 'Enrolled';
        attendee.userid = user.id;
        attendee.eventid = eventid;
        attendee.classID = zfattendee.classId;
        attendee.spot_id = spotId; // prioritize dibs spots over zingfit spots
        await attendee.save();

        if (!attendee.dropped && eventid) {
          const [transaction] = await models.dibs_transaction.findOrCreate({
            where: {
              saleid: String(zfattendee.attendanceId),
              dibs_studio_id: studio.id,
              userid: user.id,
            },
            defaults: {
              eventid,
              purchasePlace: 'offsite',
              description: 'Zingfit Offsite Booking',
              amount: 0,
              original_price: 0,
              status: 1,
              type: 'class',
            },
            paranoid: false,
          });
          transaction.spot_id = spotId;
          await transaction.save();
        }
        // for the classpass offsite drop case
        if (attendee.dropped && eventid) {
          await offsiteDropOffsiteZFTransactions(attendee, studio.id);
        }
        return null;
      }, { concurrency: 1 });
      return userStudio.clientid;
    } catch (err) {
      errorHelper.handleError({
        opsSubject: 'Zingfit Attendance Mapper Error',
        opsIncludes: `User ${user.id} - ${user.email} had an invalid response from Zingfit for studio ${studio.id}. `
                   + 'This did not cause the roster load to fail.',
      })(err);
      return userStudio.clientid;
    }
  },
  dropFakeAttendees(clientids, eventid) {
    if (!clientids.length) return [];
    return models.attendees.destroy({
      where: {
        eventid,
        clientID: clientids,
        dropped: false,
        // if first character is a '-'
        attendeeID: { [Op.like]: '-%' },
      },
    });
  },
  async zfPsuedoAttendeeMap(clientids, clientSpotMap, event, studio, room) {
    if (clientids.length === 0 || isEmpty(clientSpotMap)) return null;
    const insertValues = clientids.reduce((acc, clientid) => (!clientSpotMap[clientid]
        ? '' : `
    (
      ${studio.studioid},
      '-${event.eventid}${clientSpotMap[clientid].id || 0}${clientid}',
      '${event.classid}',
      'zf',
      '${clientid}',
      ${null},
      ${null},
      ${null},
      false,
      '${moment(event.start_date)
        .format('YYYY-MM-DD HH:mm:ss')
        .toString()}',
      false,
      '${moment()
        .format('YYYY-MM-DD HH:mm:ss')
        .toString()}',
      '${moment()
        .format('YYYY-MM-DD HH:mm:ss')
        .toString()}',
      ${studio.id},
      ${null},
      ${event.eventid},
      ${
      (room.sourceIdMappedSpots[
            clientSpotMap[clientid]].id) ||
      null}
    ),
    ${acc}`), '');
    if (!insertValues.trim()) return null;
    const query = `INSERT INTO attendees
          ("studioID",
          "attendeeID",
          "classID",
          source,
          "clientID",
          email,
          firstname,
          lastname,
          checkedin,
          "visitDate",
          dropped,
          "createdAt",
          "updatedAt",
          dibs_studio_id,
          userid,
          eventid,
          spot_id
        )
        VALUES
        ${insertValues.trim().slice(0, insertValues.trim().length - 1)}
        ON CONFLICT ON CONSTRAINT attendees_pkey DO UPDATE
        SET
        "studioID" = EXCLUDED."studioID",
        "attendeeID" = EXCLUDED."attendeeID",
        "classID" = EXCLUDED."classID",
        "clientID" = EXCLUDED."clientID",
        email = EXCLUDED.email,
        firstname = EXCLUDED.firstname,
        lastname = EXCLUDED.lastname,
        "serviceName" = EXCLUDED."serviceName",
        "serviceID" = EXCLUDED."serviceID",
        checkedin = EXCLUDED.checkedin,
        "visitDate" = EXCLUDED."visitDate",
        dropped = EXCLUDED.dropped,
        "updatedAt" = EXCLUDED."updatedAt",
        dibs_studio_id = EXCLUDED.dibs_studio_id,
        source_serviceid = EXCLUDED.source_serviceid,
        userid = EXCLUDED.userid,
        eventid = EXCLUDED.eventid;
        `;
    await models.sequelize.query(query);
    // return a map of customers that are still not in the actual class
    return clientids.reduce((acc, val) => {
      if (!clientSpotMap[val]) acc[val] = true;
      return acc;
    }, {});
  },
};
