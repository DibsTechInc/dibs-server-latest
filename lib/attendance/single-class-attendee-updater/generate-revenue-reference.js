const Decimal = require('decimal.js');
const models = require('@dibs-tech/models');
/**
 * @param {number} studioid  external studio identifier
 * @param {number} serviceid  attendee service identifier
 * @param {string} serviceName  name of service
 * @param {number} price price of service
 * @param {RegExp} membershipRegex  membership expression check
 * @param {number} cpAmount  class pass price for studio
 * @param {number} dibsStudioId  internal studio id
 * @param {number} count  # of uses
 * @returns {SequelizeInstance} revenue reference instance
 */
function generate(studioid, serviceid, serviceName, price, membershipRegex, cpAmount, dibsStudioId, count = 1) {
  let revenueDefaults;
  if (serviceName.match(/classpass|class pass/i)) {
    revenueDefaults = {
      DibsCategory1: 'B',
      DibsCategory2: 'B2',
      avgRevenue: cpAmount || 16,
    };
  } else if (serviceName.match(/dibs/i)) {
    revenueDefaults = {
      DibsCategory1: 'D',
      DibsCategory2: 'D',
      avgRevenue: null,
    };
  } else {
    revenueDefaults = {
      DibsCategory1: 'M',
      DibsCategory2: 'M',
      avgRevenue: price !== null ? new Decimal(price).dividedBy(count).toNumber() : 20,
    };
  }
  revenueDefaults.paymentCategory = serviceName;
  revenueDefaults.source = 'mb';
  revenueDefaults.dibs_studio_id = dibsStudioId;
  // only create new records, never modify old ones
  return models.revenue_reference.findOrCreate({
    where: { studioID: studioid, serviceID: String(serviceid) },
    defaults: revenueDefaults,
  }).spread((rr, created) => {
    if (created) console.log(`created new revenue reference ${serviceName}`);
    return rr;
  });
}

module.exports = { generate }