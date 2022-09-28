const Promise = require('bluebird');
const purchaseErrorLib = require('../../../errors/purchasing');

const priceAscSort = (itemA, itemB) => itemA.price - itemB.price;
const zeroPriceLastSort = item => (item.price ? 0 : 1);

module.exports = {
  /**
   * @param {Object} cart user is checking out with
   * @returns {Array<Object>} sorted event items
   */
  sortEvents(cart) {
    return cart.events.sort(priceAscSort)
                      .sort((itemA, itemB) => (
                        (itemA.passid && !itemB.passid && -1) ||
                        (!itemA.passid && itemB.passid && 1) || 0
                      ))
                      .sort(zeroPriceLastSort);
  },
  /**
   * @param {Object} cart user is checking out with
   * @returns {Array<Object>} sorted package items
   */
  async sortPackages(cart) {
    let failedPackageId;
    try {
      const packageItems = await Promise.map(cart.packages, async (item) => {
        try {
          item.price = await item.studioPackage.getCurrentPrice({ autopay: item.autopay });
        } catch (err) {
          failedPackageId = item.packageid;
          throw err;
        }
        return item;
      }, { concurrency: 1 });
      return packageItems.sort(priceAscSort).sort(zeroPriceLastSort);
    } catch (err) {
      throw new purchaseErrorLib.PackagePriceCalculationError(err, { packageid: failedPackageId });
    }
  },
};
