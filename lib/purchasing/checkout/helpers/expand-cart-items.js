const purchaseErrorLib = require('../../../errors/purchasing');

const DEFAULT_MAX_CART_QUANTITY = 4;

/**
 * @param {string} key of item, can be 'events' or 'packages'
 * @param {Object} cart at checkout
 * @param {number} employeeid of employee making checkout
 * @returns {Array<Object>} expanded cart items
 */
function expandCartItems(key, cart, employeeid) {
  return cart[key] ? (
    cart[key].reduce((acc, { quantity, spotIds, ...rest }) => {
      if (!quantity || quantity < 0) throw new purchaseErrorLib.CartError(`Invalid ${key} quantity`);

      const item = rest;
      let maxEnrollmentSetting;
      if (key === 'events') {
        maxEnrollmentSetting = item.event.studio.dibs_config.maximum_allowed_client_enrollment;
      }

      if (
        (key === 'events')
        && (!employeeid)
        && (quantity > (maxEnrollmentSetting || DEFAULT_MAX_CART_QUANTITY))
      ) {
        throw new purchaseErrorLib.CartError(
          'Invalid events quantity, more than the maximum allowed.\n' // eslint-disable-line prefer-template
            + `Dibs config setting: ${maxEnrollmentSetting}\n`
            + (maxEnrollmentSetting ? 'Used Dibs config value' : 'Used default value'));
      }
      for (let i = 0; i < quantity; i += 1) {
        if (spotIds) item.spotId = spotIds[i];
        acc.push(item);
      }
      return acc;
    }, [])
  ) : [];
}

expandCartItems.DEFAULT_MAX_CART_QUANTITY = DEFAULT_MAX_CART_QUANTITY;
module.exports = expandCartItems;
