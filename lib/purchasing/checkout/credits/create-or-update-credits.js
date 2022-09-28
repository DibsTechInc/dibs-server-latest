const Promise = require('bluebird');
const { CreditPurchaseError } = require('../../../errors/purchasing');

module.exports = async function createOrUpdateCredit(user, cart, sqlTransaction) {
  if (!cart.credits.length) return cart;
  return {
    ...cart,
    credits: await Promise.map(cart.credits, async ({ creditTier, ...item }) => {
      try {
        await user.addCreditForStudio(
          creditTier.receiveAmount,
          creditTier.studio,
          {
            save: true,
            transaction: sqlTransaction,
            associatedTransactionId: item.dibsTransaction.id,
            creditTier,
            creditTransactionType: models.credit_transaction.Types.CREDIT_LOAD,
          }
        );
        return { creditTier, ...item };
      } catch (err) {
        throw new CreditPurchaseError(err, { creditTierId: creditTier.id });
      }
    }, { concurrency: 1 }),
  };
};
