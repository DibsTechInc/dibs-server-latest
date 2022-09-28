const { groupBy } = require('lodash');
const MBClient = require('@dibs-tech/mindbody-client');
const resolveNestedObject = require('../../../helpers/resolve-nested-object');
const Promise = require('bluebird');
const MailClient = require('@dibs-tech/mail-client');
const { CheckWaitlistError } = require('../../../errors/booking');
const { Op } = require('sequelize');
const models = require('../../../../models/sequelize');

const mc = new MailClient();

/**
 * @param {MBClient} mbc MBClient instance
 * @param {Object} event instance
 * @param {string} clientid of the user going on the waitlist
 * @returns {Promise<string>} Dibs client service id
 */
async function updateDibsClientService(mbc, event, clientid, clientVisit) {
  const mbServiceDibs = await models.mb_service.findOne({
    where: {
      name: { [Op.iLike]: 'Dibs' },
      mbstudioid: event.studioid,
      mbprogramid: event.programid,
    },
  });
  if (!mbServiceDibs) throw new Error(`No Dibs service with MB studio id ${event.studioid} and MB program id ${event.programid}`);
  const visitServices = [{
    serviceid: mbServiceDibs.mbserviceid,
    visitids: [clientVisit.ID],
  }];
  await Promise.promisify(mbc.updateVisitService, { context: mbc })(clientid, visitServices, process.env.TEST_PURCHASES);
}

/**
 * @param {Object} mbc instance of Mindbody client
 * @param {Object} dibsTransaction waitlist transaction we are verifying the service for
 * @param {Object} clientVisit visit that got user off waitlist, from MB response
 * @param {Object} servicesByStudio Dibs Mindbody services sorted by studio
 * @returns {undefined}
 */
function verifyService(mbc, dibsTransaction, clientVisit) {
  const offsiteServiceId = dibsTransaction.pass && dibsTransaction.pass.source_serviceid;
  if ((offsiteServiceId && offsiteServiceId !== clientVisit.Service.ID)
      || (!offsiteServiceId && !/unpaid/i.test(clientVisit.Service.Name))) {
    let body = `Studio: ${dibsTransaction.dibs_studio.name}: User ${dibsTransaction.userid} - ${dibsTransaction.user.email} was taken off the waitlist for event ${dibsTransaction.event.name} - ${dibsTransaction.event.start_date} using service ${clientVisit.Service.ID}: ${clientVisit.Service.Name}. `;
    if (offsiteServiceId) body += `We expected them to use offsite service ${offsiteServiceId}.`;
    else body += 'We expected to need to apply a Dibs service to an unpaid booking.';
    mc.ops('ACTION REQUIRED: Waitlist Service Mismatch', body);
  }
}

/**
 * @param {Object} transactionsByClassId waitlist transactions sorted by class id
 * @param {Object} acc reduce acculumator, fulfilled and unfulfilled transactions in plain object
 * @param {string} classid for the class people are waitlisted for
 * @returns {Object} reduce accumulator
 */
async function checkVisitsForClassId(transactionsByClassId, acc, classid) {
  const transactions = transactionsByClassId[classid];
  const [{ studioid }] = transactions;
  const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, studioid);
  const getClassVisitsResp = await Promise.promisify(mbc.getVisits, { context: mbc })(classid);
  const visits = resolveNestedObject(getClassVisitsResp, 'GetClassVisitsResult', 'Class', 'Visits', 'Visit');
  if (!visits || !visits.length) {
    acc.unfulfilledTransactions.push(...transactions);
    return acc;
  }
  await Promise.each(transactions, async (dibsTransaction) => {
    const userStudio = dibsTransaction.user.userStudios.find(us => us.dibs_studio_id === dibsTransaction.dibs_studio_id);
    const clientid = (dibsTransaction.pass && dibsTransaction.pass.clientid) || userStudio.clientid;
    const clientVisit = visits.find(visit => visit.Client.ID === clientid);
    acc[clientVisit ? 'fulfilledTransactions' : 'unfulfilledTransactions'].push(dibsTransaction);
    if (clientVisit) {
      verifyService(mbc, dibsTransaction, clientVisit);
      if (!dibsTransaction.pass || !dibsTransaction.pass.source_serviceid) await updateDibsClientService(mbc, dibsTransaction.event, clientid, clientVisit);
    }
  });
  return acc;
}

module.exports = async function checkMindbodyWaitlist(dibsTransactions) {
  try {
    if (!dibsTransactions) {
      return {
        fulfilledTransactions: [],
        unfulfilledTransactions: [],
      };
    }
    const transactionsByClassId = groupBy(dibsTransactions, t => t.event.classid);
    const result = await Promise.reduce(
      Object.keys(transactionsByClassId),
      checkVisitsForClassId.bind(null, transactionsByClassId),
      {
        fulfilledTransactions: [],
        unfulfilledTransactions: [],
      }
    );
    return result;
  } catch (err) {
    throw new CheckWaitlistError(err);
  }
};
