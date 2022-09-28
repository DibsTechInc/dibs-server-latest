const { uniq } = require('lodash');
const extractInnerList = require('../../../helpers/extract-inner-list');
const failOnOffboarded = require('../helpers/fail-on-offboarded');
const purchaseErrorLib = require('../../../errors/purchasing');

/**
 * @param {Array<Object>} packageItems in cart
 * @returns {Array<Object>} cart package items with their associated package instances
 */
module.exports = async function queryPackages(packageItems) {
  if (!packageItems.length) return [];
  const packids = uniq(packageItems.map(item => +item.packageid));
  const packages = await models.studio_packages.findAll({
    where: { id: packids },
    include: [
      {
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
      },
    ],
  });
  extractInnerList(packages, 'studio', 'id').map(failOnOffboarded);
  const packageItemsWithData = packageItems.map(
    ({ packageid, ...item }) => ({ ...item, packageid, studioPackage: packages.find(p => +p.id === +packageid) })
  );
  const itemsWithoutPackage = uniq(packageItemsWithData.filter(item => !item.studioPackage).map(item => item.packageid));
  if (itemsWithoutPackage.length) {
    throw new purchaseErrorLib.CartError(`Cart item has non existent packageid(s): ${itemsWithoutPackage.join(', ')}`);
  }
  return packageItemsWithData;
};
