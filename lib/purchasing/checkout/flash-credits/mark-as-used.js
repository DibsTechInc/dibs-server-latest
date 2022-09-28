const { FlashCreditApplicationError } = require('../../../errors/purchasing');
const Promise = require('bluebird');
const flashCreditEmailLib = require('../../../emails/flash-credits');

module.exports = async function markFlashCreditAsUsed(user, cart, sqlTransaction) {
  if (cart.events.every(({ flashCredit }) => !flashCredit)) return cart;
  try {
    return {
      ...cart,
      events: await Promise.map(cart.events, async ({ flashCredit, ...item }) => {
        if (!flashCredit) return item;
        flashCreditEmailLib.sendSecretUnlockedEmail(user, flashCredit);
        try {
          await flashCredit.destroy({ transaction: sqlTransaction });
        } catch (err) {
          throw new FlashCreditApplicationError(err, { flashCreditId: flashCredit.id });
        }
        return { ...item, flashCredit };
      }),
    };
  } catch (err) {
    if (err instanceof FlashCreditApplicationError) throw err;
    throw new FlashCreditApplicationError(err);
  }
};
