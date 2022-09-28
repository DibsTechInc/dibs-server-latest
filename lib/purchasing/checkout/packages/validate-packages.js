const purchaseErrorLib = require('../../../errors/purchasing');
const Promise = require('bluebird');

/**
 * @param {Object} user making the checkout
 * @param {Object} cart the user is checking out
 * @returns {undefined}
 */
module.exports = async function validatePackages(user, cart) {
  if (!cart.packages.length) return;
  await Promise.each(cart.packages, async ({ studioPackage, quantity }) => {
    if (studioPackage.onlyFirstPurchase) {
      const isValidOnlyFirstPurchase = await studioPackage.isValidOnlyFirstPurchase(user);
      if (!isValidOnlyFirstPurchase || (isValidOnlyFirstPurchase && quantity > 1)) {
        throw new purchaseErrorLib.PackagePurchaseError(
          `This is only available as a first purchase at this studio.${isValidOnlyFirstPurchase && quantity > 1 ? ' You cannot purchase more than 1 of this item.' : ''}`,
          { firstPurchaseError: true }
        );
      }
    }
    if (studioPackage.packagePurchaseLimit) {
      const isValidWithPurchaseLimit = await studioPackage.isValidWithPurchaseLimit(user, { quantity });
      if (!isValidWithPurchaseLimit) throw new purchaseErrorLib.PackagePurchaseError('You\'ve already purchased this package the maximum number of times.', { packageLimitError: true });
    }
  });
};
