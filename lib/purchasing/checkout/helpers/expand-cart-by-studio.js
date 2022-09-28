const { groupBy, uniq } = require('lodash');

/**
 * @param {Object} cart user checked out with
 * @returns {Object} cart separated by studio, each key is a dibs_studio_id and
 *                   each value is a cart object for just that studio
 */
module.exports = function expandCartByStudio({ events, packages, credits, giftCards }) {
  const groupByStudio = (items, key) => groupBy(items, item => item[key].dibs_studio_id);
  const creditsByStudio = groupByStudio(credits, 'creditTier');
  const eventsByStudio = groupByStudio(events, 'event');
  const packsByStudio = groupByStudio(packages, 'studioPackage');
  const giftCardsByStudio = groupBy(giftCards, 'dibsStudioId');
  const studioIds = uniq([
    ...Object.keys(creditsByStudio),
    ...Object.keys(eventsByStudio),
    ...Object.keys(packsByStudio),
    ...Object.keys(giftCardsByStudio),
  ]);
  const cartByStudio = {};
  studioIds.forEach(studioId => cartByStudio[studioId] = {
    events: eventsByStudio[studioId] || [],
    packages: packsByStudio[studioId] || [],
    credits: creditsByStudio[studioId] || [],
    giftCards: giftCardsByStudio[studioId] || [],
  });
  return cartByStudio;
};
