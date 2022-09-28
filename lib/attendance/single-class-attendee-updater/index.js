const Promise = require('bluebird');
const offsiteDropPublisher = require('../../publishers/offsite-drop-publisher');
const generateRevenueReference = require('./generate-revenue-reference');
const errorHelper = require('@dibs-tech/dibs-error-handler');
const moment = require('moment-timezone');
const models = require('@dibs-tech/models');
const { Op } = require('sequelize');

/**
 * singleClassAttendeeUpdater
 * @param {String} eventid id of event to update
 * @param {Number} dibsStudioId id of studio w event
 * @param {Array<Object>} visits list of visit objects from Mindbody, people on the class roster (can be late cancels)
 * @returns {Promise} attendee data saved
 */
module.exports = async function singleClassAttendeeUpdater(eventid, dibsStudioId, visits) {
  try {
    const visitIds = visits.map(visit => (visit.Service ? String(visit.ID) : false)).filter(v => v);
    const studio = await models.dibs_studio.findById(dibsStudioId, { include: [{ model: models.dibs_config, as: 'dibs_config' }] });
    const event = await models.event.findOne({ where: { eventid } });

    const getQueryParams = attendeeIDQuery => ({
      studioID: studio.studioid,
      source: 'mb',
      classID: String(event.classid),
      attendeeID: attendeeIDQuery,
      dropped: false,
    });
    const publishOffsiteDrop = (offsiteDropVisitIds, early) => {
      if (!offsiteDropVisitIds.length) return;
      offsiteDropPublisher.publish({
        dibsStudioId,
        classid: event.classid,
        visitIds: offsiteDropVisitIds,
        early,
      });
    };

    // Early drops are attendees who used to be in the class but are no longer in the class
    const [, earlyDropAttendees] = await models.attendees.update({ dropped: true, early_cancel: true }, {
      where: getQueryParams({ [Op.notIn]: visitIds }),
      returning: true,
    });
    const earlyDropAttendeesIds = earlyDropAttendees.map(a => a.attendeeID);
    publishOffsiteDrop(earlyDropAttendeesIds, true);

    // Late drops are attendees who still show up in the class list, however their visit is marked as LateCancelled
    const lateCancels = visits.map(visit => (visit.LateCancelled ? String(visit.ID) : false)).filter(v => v);
    const [, lateDropAttendees] = await models.attendees.update({ dropped: true, early_cancel: false }, {
      where: getQueryParams({ [Op.in]: lateCancels }),
      returning: true,
    });
    const lateDropAttendeeIds = lateDropAttendees.map(a => a.attendeeID);
    publishOffsiteDrop(lateDropAttendeeIds, false);

    const filteredVisits = visits.filter(v => !v.LateCancelled);
    event.spots_booked = filteredVisits.length;
    return await Promise.map(filteredVisits, async (visit) => {
      const [_psuedoService] = await models.pseudo_client_services.findOrInitialize({
        where: {
          studioid: studio.studioid,
          name: visit.Service.Name,
          source: 'mb',
        },
      });
      const pseudoService = await _psuedoService.save();
      const revenueReference = await generateRevenueReference.generate(studio.studioid, pseudoService.id, pseudoService.name, null, '', studio.cpAmount || 16, studio.id);
      const [attendee, attendeeCreated] = await models.attendees.findOrInitialize({
        where: {
          attendeeID: String(visit.ID),
          studioID: studio.studioid,
          source: 'mb',
          classID: String(event.classid),
          dibs_studio_id: studio.id,
        },
        defaults: {
          clientID: String(visit.Client.ID),
          email: visit.Client.Email ? visit.Client.Email.toLowerCase() : `placeholder${visit.Client.ID}@ondibs.com`,
          firstname: visit.Client.FirstName,
          lastname: visit.Client.LastName,
          serviceName: visit.Service.Name,
          serviceID: String(pseudoService.id),
          source_serviceid: String(visit.Service.ID),
          checkedin: visit.SignedIn,
          visitDate: moment(visit.StartDateTime).format('YYYY-MM-DD HH:mm:ss').toString(),
          dropped: false,
          revenue: visit.Service.Name.toLowerCase() === 'dibs' ? null : 0,
          cost: 0,
        },
      });
      if (revenueReference) attendee.cost = revenueReference.avgRevenue;
      if (!attendeeCreated) {
        attendee.classID = String(event.classid);
        attendee.studioID = studio.studioid;
        attendee.clientID = String(visit.Client.ID);
        attendee.email = visit.Client.Email ? visit.Client.Email.toLowerCase() : `placeholder${visit.Client.ID}@ondibs.com`;
        attendee.firstname = visit.Client.FirstName;
        attendee.lastname = visit.Client.LastName;
        attendee.serviceName = visit.Service.Name;
        attendee.checkedin = visit.SignedIn;
        attendee.visitDate = moment(visit.StartDateTime).format('YYYY-MM-DD HH:mm:ss').toString();
        attendee.serviceID = String(pseudoService.id);
        attendee.source_serviceid = String(visit.Service.ID);
        attendee.dropped = false;
        attendee.source = 'mb';
        attendee.revenue = visit.Service.Name === 'Dibs' ? null : 0;
      }
      if (attendee.changed()) event.changed('updatedAt', true);
      return await Promise.all([
        attendee.save().catch(err => (
          err.name === 'SequelizeUniqueConstraintError' ? Promise.resolve()
                                                        : Promise.reject(err)
        )),
        event.save(),
      ]);
    });
  } catch (err) {
    errorHelper.handleError({
      opsSubject: 'Single Attendee Sync Error',
    })(err);
    return null;
  }
};
