const Promise = require('bluebird');
const ZingfitClient = require('@dibs-tech/zingfit-client');
const { groupBy } = require('lodash');

/**
 *
 * @param {Array<object>} transactionsByClassId list of transactions
 * @param {Object} zfc zingfit client
 * @param {Object} acc  accumulator
 * @param {number} classid  specific class
 * @returns {object} accumulator
 */
async function checkSpotsForClassId(transactionsByClassId, zfc, acc, classid) {
  zfc.regionid = transactionsByClassId[classid][0].event.location.region_id;
  const spotsResponse = await zfc.getSpots(classid);
  await transactionsByClassId[classid].map((transaction) => {
    const userStudio = transaction.user.userStudios.find(uS => uS.dibs_studio_id === transaction.dibs_studio_id);
    const fulfilled = spotsResponse.some(s => s.customerId === (userStudio && userStudio.clientid) && s.status === 'Enrolled');
    return fulfilled ? acc.fulfilledTransactions.push(transaction) : acc.unfulfilledTransactions.push(transaction);
  });
  return acc;
}

/**
 *
 * @param {Array<object>} dibsTransactions  list of transactions
 * @returns {Object} fulfilled and unfulfilled transactions
 */
module.exports = async function checkWaitlist(dibsTransactions) {
  if (!dibsTransactions) {
    return {
      fulfilledTransactions: [],
      unfulfilledTransactions: [],
    };
  }

  const zfc = new ZingfitClient(dibsTransactions[0].dibs_studio.client_id, dibsTransactions[0].dibs_studio.client_secret);

  const transactionsByClassId = groupBy(dibsTransactions, t => t.event.classid);

  const result = await Promise.reduce(
    Object.keys(transactionsByClassId),
    checkSpotsForClassId.bind(null, transactionsByClassId, zfc),
    {
      fulfilledTransactions: [],
      unfulfilledTransactions: [],
    }
  );
  return result;
};
