const { CreditApplicationError } = require('../../../errors/purchasing');
const Decimal = require('decimal.js');
const Promise = require('bluebird');


/**
 * @param {string} type of credit, see switch statement for possible values
 * @param {Object} user instance making purchase
 * @param {Array<Object>} dibsTransaction instance of dibs_transaction
 * @param {Object} sqlTransaction sequelize transaction
 * @returns {Promise<Array<Object>>} updated dibs_transaction
 */
async function applyCreditToTransaction(type, user, dibsTransaction, sqlTransaction) {
  try {
    const applyCreditMethod = type === 'studio' ? 'applyStudioCredit' : 'applyRafCredit';
    const credit = user.findCredit(type, dibsTransaction.dibs_studio_id);
    if (!credit || !credit.credit) return dibsTransaction;

    const creditToApply = Math.min(credit.credit, Decimal(dibsTransaction.amount).minus(dibsTransaction.studio_credits_spent).minus(dibsTransaction.raf_credits_spent));
    await dibsTransaction[applyCreditMethod](creditToApply, {
      save: true,
      transaction: sqlTransaction,
    });

    await credit.deductAmount(creditToApply, {
      save: true,
      transaction: sqlTransaction,
      associatedTransactionId: dibsTransaction.id,
      creditTransactionType: models.credit_transaction.Types.CREDIT_APPLICATION,
    });

    return dibsTransaction;
  } catch (err) {
    throw new CreditApplicationError(type, err);
  }
}

/**
 * @param {string} type of credit, see switch statement for possible values
 * @param {Object} user instance making purchase
 * @param {Array<Object>} cart of items without passes
 * @param {Object} sqlTransaction sequelize transaction
 * @returns {Promise<Array<Object>>} updated cart after credits are applied
 */
async function applyCreditToCart(type, user, cart, sqlTransaction) {
  try {
    const applyCreditMethod = type === 'studio' ? 'applyStudioCredit' : 'applyRafCredit';
    const credit = user.findCredit(type, cart[0].event.dibs_studio_id);
    if (!credit || !credit.credit) return cart;

    let creditRemaining = Decimal(credit.credit);

    const cartAfterCredit = await Promise.map(cart, async ({ dibsTransaction, ...cartItem }) => {
      const creditToApply = Math.min(+creditRemaining, Decimal(dibsTransaction.amount).minus(dibsTransaction.studio_credits_spent).minus(dibsTransaction.raf_credits_spent));
      creditRemaining = Decimal(Math.max(+creditRemaining.minus(creditToApply), 0));
      await credit.deductAmount(creditToApply, {
        save: true,
        transaction: sqlTransaction,
        associatedTransactionId: dibsTransaction.id,
        creditTransactionType: models.credit_transaction.Types.CREDIT_APPLICATION,
      });
      return {
        ...cartItem,
        dibsTransaction: await dibsTransaction[applyCreditMethod](creditToApply, {
          save: true,
          transaction: sqlTransaction,
        }),
      };
    }, { concurrency: 1 });

    return cartAfterCredit;
  } catch (err) {
    throw new CreditApplicationError(type, err);
  }
}

module.exports = {
  applyStudioCredit: applyCreditToCart.bind(null, 'studio'),
  applyRafCredit: applyCreditToCart.bind(null, 'raf'),
  applyStudioCreditToTransaction: applyCreditToTransaction.bind(null, 'studio'),
  applyRafCreditToTransaction: applyCreditToTransaction.bind(null, 'raf'),
};
