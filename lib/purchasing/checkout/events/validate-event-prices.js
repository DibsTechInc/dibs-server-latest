const { Op } = require('sequelize');
const moment = require('moment');
const { EventPriceValidationError } = require('../../../errors/purchasing');
const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');

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
 * @param {*} cart the user is checking out with
 * @returns {undefined}
 */
module.exports = async function validateEventPrices(user, cart) {
  if (!cart.events.length) return;
  let appliedFirstClassFixedPrice = false;
  try {
    const fixedPrices = {};
    const pricingHistories = {};
    const eventsWithLowPrices = [];
    await Promise.each(cart.events, async ({ eventid, price, event: { dibs_studio_id, studio, free_class: free } }) => {
      if (free && (price === 0)) return;
      if (fixedPrices[dibs_studio_id] === undefined) {
        fixedPrices[dibs_studio_id] = await user.getMemberFixedPrice(dibs_studio_id);
      }
      if (fixedPrices[dibs_studio_id] === price) return;
      if (!pricingHistories[eventid]) pricingHistories[eventid] = {};
      if (!pricingHistories[eventid][price]) {
        const historyEntry = await models.pricing_history.findOne({
          attributes: ['id'],
          where: {
            eventid,
            currentPrice: price,
            // lastVisible: {
            //   [Op.or]: [
            //     { [Op.gte]: moment().subtract(5, 'minutes').toDate() },
            //     { [Op.is]: null },
            //   ],
            // },
          },
        });
        console.log(`historyEntry: ${historyEntry}`);
        if (
          !historyEntry
          && studio.dibs_config.first_class_fixed_price
          && !appliedFirstClassFixedPrice
          && !(await user.hasMadePurchaseAtStudio(dibs_studio_id))
          && (price === studio.dibs_config.first_class_fixed_price)
        ) {
          appliedFirstClassFixedPrice = true;
        } else if (!historyEntry) {
          throw new EventPriceValidationError(`Event ${eventid} is no longer available for ${price}`, { eventid });
        } else {
          if (price <= 10) eventsWithLowPrices.push({ eventid, price });
          pricingHistories[eventid][price] = true;
        }
      }
    });
    if (eventsWithLowPrices.length) sendLowPriceWarining(user, eventsWithLowPrices);
  } catch (err) {
    if (err.constructor === EventPriceValidationError) throw err;
    throw new EventPriceValidationError(err);
  }
};
