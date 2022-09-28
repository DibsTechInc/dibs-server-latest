const { Op } = require('sequelize');
const { FlashCreditAssociationError } = require('../../../errors/purchasing');


/**
   * @param {Object} user instance
   * @param {Object} cart user is checking out
   * @param {number} dibsStudioId id of studio
   * @returns {Array<Object>} cart with flash credit applied to the right event
   */
module.exports = async function associateFlashCreditsToCartEventItems(user, cart, dibsStudioId) {
  if (cart.events.every(item => !item.price)) return cart; // also handles empty cart case
  try {
    const flashCredits = await models.flash_credit.findAll({
      where: {
        userid: user.id,
        dibs_studio_id: dibsStudioId,
        expiration: { [Op.gte]: sequelize.fn('now') },
      },
      include: [{ model: models.dibs_studio, as: 'studio' }],
    });
    if (!flashCredits.length) return cart;

    // if any of the charges are going to be paid for with money versus
    // a pass, we want to apply the flash credit to that
    const singlesInCart = cart.events.filter(
      item => (item.price && !item.passid)
    ).length;

    return {
      ...cart,
      events: cart.events.map((item) => {
        // operates under assumption that classes with a pass are placed first in the cart
        if (
          ((flashCredits.length <= singlesInCart) && item.passid)
          || (flashCredits.length === 0)
          || (!item.price)
        ) return item;
        return {
          ...item,
          flashCredit: flashCredits.pop(),
        };
      }),
    };
  } catch (err) {
    throw new FlashCreditAssociationError(err);
  }
};
