const { uniq } = require('lodash');
const extractInnerList = require('../../../helpers/extract-inner-list');
const failOnOffboarded = require('../helpers/fail-on-offboarded');
const { CartError } = require('../../../errors/purchasing');

module.exports = async function queryCreditTiers(creditItems) {
  if (!creditItems.length) return [];
  const creditTierIds = uniq(creditItems.map(item => item.creditTierId));
  const creditTiers = await models.credit_tier.findAll({
    where: { id: creditTierIds },
    include: [{
      model: models.dibs_studio,
      as: 'studio',
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
    }],
  });
  extractInnerList(creditTiers, 'studio', 'id').map(failOnOffboarded);
  const creditItemsWithData = creditItems.map(item => ({
    ...item,
    creditTier: creditTiers.find(
      creditTier => creditTier.id === item.creditTierId),
  }));
  const itemsWithoutCreditTiers = uniq(creditItemsWithData.filter(item => !item.creditTier).map(item => item.creditTierId));
  if (itemsWithoutCreditTiers.length) {
    throw new CartError(`Cart item has non existent credit tier id(s): ${itemsWithoutCreditTiers.join(', ')}`);
  }
  return creditItemsWithData;
};
