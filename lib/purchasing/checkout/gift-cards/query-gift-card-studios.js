const { uniq, groupBy } = require('lodash');
const { CartError } = require('../../../errors/purchasing');
const failOnOffboarded = require('../helpers/fail-on-offboarded');

/**
 * @param {Array<Object>} giftCardItems gift card items for checkout
 * @returns {Promise<Array<Object>>} giftCardItems with associated studio object
 */
module.exports = async function queryGiftCardStudios(giftCardItems) {
  if (!giftCardItems.length) return giftCardItems;
  const dibsStudioIds = uniq(giftCardItems.map(item => +item.dibsStudioId));
  const studios = await models.dibs_studio.findAll({
    where: { id: dibsStudioIds },
    include: [
      {
        model: models.dibs_config,
        as: 'dibs_config',
      },
      {
        model: models.dibs_studio_locations,
        as: 'locations',
      },
    ],
  });
  studios.map(failOnOffboarded);
  const studiosById = groupBy(studios, 'id');
  return giftCardItems.map((item) => {
    const studio = studiosById[item.dibsStudioId][0];
    if (!studio) {
      throw new CartError(
        'The user\'s cart has a gift card with an invalid studio ID');
    }
    if (!studio.dibs_config.display_giftcards) {
      throw new CartError(
        'The user attempted to purchase a gift card for a studio that does not offer them.');
    }
    return { ...item, studio };
  });
};
