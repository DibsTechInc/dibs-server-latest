const { Op } = require('sequelize');
const moment = require('moment');
const MailClient = require('@dibs-tech/mail-client');

const mc = new MailClient();

/**
 * @param {Object} user making purchase
 * @param {Array<Object>} eventsWithLowPrices eventid price combinations of classes with original prices <= 10
 * @returns {undefined}
 */
function sendLowPriceWarining(user, eventsWithLowPrices) {
  const lowPriceMessage = eventsWithLowPrices.map(({ eventid, price }) => `event ${eventid} with an original price of ${price}`).join(', ');
  mc.ops(
    'Low Price Warning',
    `User ${user.id} purchased ${lowPriceMessage}`
  );
}

/**
 * @param {Object} user who purchase is for
 * @param {String} eventid eventid
 * @param {Number} price price
 * @returns {undefined}
 */
module.exports = async function validateEventPrice(user, eventid, price) {
  try {
    const pricingHistories = {};
    const eventsWithLowPrices = [];
    if (!pricingHistories[eventid]) pricingHistories[eventid] = {};
    if (!pricingHistories[eventid][price]) {
      const historyEntry = await models.pricing_history.findOne({
        attributes: ['id'],
        where: {
          eventid,
          currentPrice: price,
          lastVisible: {
            [Op.or]: [
              { [Op.gte]: moment().subtract(5, 'minutes').toDate() },
              { [Op.is]: null },
            ],
          },
        },
      });
      if (!historyEntry) {
        throw new Error(`Event ${eventid} is no longer available for ${price}`, { eventid });
      } else {
        if (price <= 10) eventsWithLowPrices.push({ eventid, price });
        pricingHistories[eventid][price] = true;
      }
    }
    if (eventsWithLowPrices.length) sendLowPriceWarining(user, eventsWithLowPrices);
  } catch (err) {
    throw err;
  }
};
