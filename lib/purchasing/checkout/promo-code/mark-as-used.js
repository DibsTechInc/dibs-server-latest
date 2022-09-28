const Promise = require('bluebird');
const { PromoCodeApplicationError } = require('../../../errors/purchasing');

module.exports = async function markPromoCodeAsUsed(user, cart, sqlTransaction) {
  if (cart.events.every(({ promoCode }) => !promoCode) && cart.packages.every(({ promoCode }) => !promoCode)) {
    return cart;
  }
  try {
    return {
      ...cart,
      events: await Promise.map(cart.events, async ({ promoCode, ...item }) => {
        if (!promoCode) return item;
        await promoCode.applyCodeToUser(user.id, sqlTransaction);
        return { ...item, promoCode };
      }),
      packages: await Promise.map(cart.packages, async ({ promoCode, ...item }) => {
        if (!promoCode) return item;
        await promoCode.applyCodeToUser(user.id, sqlTransaction);
        return { ...item, promoCode };
      }),
    };
  } catch (err) {
    throw new PromoCodeApplicationError(err);
  }
};
