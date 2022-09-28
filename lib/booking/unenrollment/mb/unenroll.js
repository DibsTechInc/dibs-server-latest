const MBClient = require('@dibs-tech/mindbody-client');
const Promise = require('bluebird');
const { UnenrollmentError } = require('../../../errors/booking');
const markAttendeeAsDropped = require('../shared/mark-attendee-as-dropped');
const safeStringify = require('json-stringify-safe');
const { uniq } = require('lodash');

const mbUnenrollment = {};
/**
 * @param {Object} user to unenroll
 * @param {Array<Object>} transactions object with \we are attempting to unenroll a client from
 * @param {Boolean} early is early cancel
 * @param {Object} optional parameters
 * @returns {Promise<undefined>} if the user is successfully unenrolled from the events, error otherwise
 */
mbUnenrollment.unenrollUserFromMindbodyEvents = async ({
  user,
  studio,
  transactions,
  early,
  clientid = null,
}) => {
  if (process.env.TEST_PURCHASES) return;
  try {
    const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, studio.studioid);

    let userStudio = {};
    if (!clientid) {
      userStudio = await models.dibs_user_studio.findOne({
        where:
          { dibs_studio_id: studio.id, userid: user.id },
      });
      if (!userStudio.clientid) throw new Error('User must have a Mindbody clientid to unenroll from a class');
    }
    const clientIdToUse = clientid || userStudio.clientid;

    const mbGetClassVisitsAsync = Promise.promisify(mbc.getVisits).bind(mbc);
    const mbUpdateVisitDropStatusAsync = Promise.promisify(mbc.updateVisitDropStatus).bind(mbc);

    const classids = uniq(transactions.map(({ event: { classid } }) => classid));
    const visitIdsToDrop = [];
    const mbResponses = await Promise.map(classids, classid => mbGetClassVisitsAsync(classid));
    await Promise.map(mbResponses, (resp) => {
      if (resp.GetClassVisitsResult.Status !== 'Success' ||
          resp.GetClassVisitsResult.ErrorCode !== 200) {
        throw new Error(`Error getting class visits from MB for user with clientid ${clientid}. Get Client visits result is ${safeStringify(resp, null, 2)}`);
      }
      let visits = resp.GetClassVisitsResult.Class &&
                   resp.GetClassVisitsResult.Class.Visits &&
                   resp.GetClassVisitsResult.Class.Visits.Visit;
      if (!visits || !visits.length) {
        throw new Error(`Get class visits from Mindbody did not return any visits for the class. Transactions are ${transactions.map(t => t.id).join(', ')}`);
      }
      visits = visits.filter(visit =>
        (String(visit.Client.ID) === clientIdToUse && !visit.LateCancelled));
      if (!visits || !visits.length) {
        throw new Error(`Get class visits from Mindbody did not return any visits for the user. Transactions are ${transactions.map(t => t.id).join(', ')}`);
      }

      const transactionsInClass = transactions.filter(t =>
        t.event.classid === String(resp.GetClassVisitsResult.Class.ID));
      transactionsInClass.forEach((transaction) => {
        let visitToDrop = visits[0];
        if (!visitToDrop) {
          return;
        }
        if (transaction.pass && transaction.pass.source_serviceid) {
          visitToDrop = visits.find(v => String(v.Service.ID) === transaction.pass.source_serviceid) || visitToDrop;
        } else {
          visitToDrop = visits.find(v => String(v.Service.Name).toLowerCase() === 'dibs') || visitToDrop;
        }
        visitIdsToDrop.push(visitToDrop.ID);
        visits = visits.filter(v => v.ID !== visitToDrop.ID);
      });
    });
    await mbUpdateVisitDropStatusAsync(visitIdsToDrop, !early);

    await Promise.map(visitIdsToDrop, vId => markAttendeeAsDropped({
      attendeeId: vId,
      studio,
      early,
    }));
  } catch (err) {
    throw new UnenrollmentError(err);
  }
};


module.exports = mbUnenrollment;
