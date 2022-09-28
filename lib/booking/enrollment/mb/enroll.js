const MBClient = require('@dibs-tech/mindbody-client');
const { Op } = require('sequelize');
const Promise = require('bluebird');
const associateClientToUser = require('../../../helpers/associate-clientid-to-user');
const { EnrollmentError } = require('../../../errors/booking');
const resolveNestedObj = require('../../../helpers/resolve-nested-object');

/**
 * @param {Array<Object>} events with event instances instance we are attempting to book a client into
 * @returns {Promise<undefined>} if the user is successfully enrolled in the events, error otherwise
 */
async function constructClassServicesFromEvents(events) {
  const mbServiceDibs = await models.mb_service.findOne({
    where: {
      name: { [Op.iLike]: 'Dibs' },
      mbstudioid: events[0].event.studioid,
      mbprogramid: events[0].event.programid,
    },
  });
  if (!mbServiceDibs) throw new EnrollmentError(`No Dibs service with MB studio id ${events[0].event.studioid} and MB program id ${events[0].event.programid}`);
  const classServices = [{
    serviceid: mbServiceDibs.mbserviceid,
    classids: events.map(({ event }) => event.classid),
  }];
  return classServices;
}

/**
 * checkResponseForEnrollmentError - MB nests their enrollment error
 * in the Class/Client part of the response, need to catch this error
 * @param {Object} response response from MB
 * @returns {undefined}
 */
function checkResponseForEnrollmentError(response) {
  const classes = resolveNestedObj(response, 'CheckoutShoppingCartResult', 'Classes', 'Class');
  if (!classes) return;
  classes.forEach((cls) => {
    const clients = resolveNestedObj(cls, 'Clients', 'Client');
    if (!clients) return;
    clients.forEach((client) => {
      // Mindbody scheduling restrictions violated enrollment error
      if (client.ErrorCode === '501') {
        throw new EnrollmentError(`Mindbody enrollment error ${JSON.stringify(client.Messages.string[0], null, 2)}`, { mbVisitRestriction: true });
      }
    });
  });
}

/**
 * @param {Object} user instance making purchase
 * @param {Array<Object>} events object with event & pass we are attempting to book a client into
 * @param {Object} userStudio instance making purchase
 * @returns {Promise<undefined>} if the user is successfully enrolled in the events, error otherwise
 */
module.exports = async function enrollUserInMindbodyEvents(user, events, userStudio) {
  const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, events[0].event.studioid);

  if (!userStudio) {
    userStudio = await models.dibs_user_studio.findOne({
      where:
        { dibs_studio_id: events[0].event.dibs_studio_id, userid: user.id },
    });
  }
  if (!userStudio || !userStudio.clientid) throw new Error('User must have a Mindbody clientid to enroll in a class');

  // Enroll in events with MB pass
  const eventsWithMbPass = events.filter(e => e.pass && e.pass.source_serviceid && !e.unpaid);
  if (eventsWithMbPass.length > 0) {
    const classIdsWithMbPass = eventsWithMbPass.reduce((acc, e) => {
      const existingItem = acc.find(item => item.sourceServiceId === e.pass.source_serviceid);
      if (existingItem) existingItem.classids.push(e.event.classid);
      else acc.push({ classids: [e.event.classid], sourceServiceId: e.pass.source_serviceid, clientId: e.pass.clientid });
      return acc;
    }, []);
    await Promise.map(classIdsWithMbPass, async (obj) => {
      await mbc.addUserToClassesWithMBPass(obj.clientId, obj.classids, obj.sourceServiceId);
    });
  }

  // Enroll in events that are unpaid
  const eventsUnpaid = events.filter(e => e.unpaid);
  if (eventsUnpaid.length > 0) {
    const unpaidClassids = eventsUnpaid.map(({ event }) => event.classid);
    await mbc.addUserToClassesWithMBPass(userStudio.clientid, unpaidClassids, null);
  }

  // Enroll in events with Dibs service
  const eventsWithDibsService = events.filter(e => (!e.pass || !e.pass.source_serviceid) && !e.unpaid);
  const enrollAsync = Promise.promisify(mbc.buyClass, { context: mbc });
  if (eventsWithDibsService.length > 0) {
    const classServices = await constructClassServicesFromEvents(eventsWithDibsService);
    // Try enrollment twice, if first enrollment fails try enrolling with duplicate user id if exists
    // If duplicate user id does not exist, create a new client id
    // TODO: (nicole) add dupe user code when models is merged into dibs_server
    let response;
    try {
      response = await enrollAsync(userStudio.clientid, classServices, (user.id === 159 || process.env.TEST_PURCHASES));
      checkResponseForEnrollmentError(response);
    } catch (err) {
      if (err instanceof EnrollmentError) throw err;
      if (!err.CheckoutShoppingCartResult || (err.CheckoutShoppingCartResult && err.CheckoutShoppingCartResult.ErrorCode !== 301)) throw new EnrollmentError(`Mindbody enrollment error ${JSON.stringify(err, null, 2)}`);
      const newClientId = await associateClientToUser.assign(user, userStudio, events[0].event.studio);
      response = await enrollAsync(newClientId, classServices, (user.id === 159 || process.env.TEST_PURCHASES));
      checkResponseForEnrollmentError(response);
    }
  }
  return null;
};
