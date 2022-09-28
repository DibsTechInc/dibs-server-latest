const { CreditApplicationError } = require('../../../errors/purchasing');
const Decimal = require('decimal.js');
const Promise = require('bluebird');
const cartHelpers = require('../helpers');

/**
 * @param {Object} args named arguments
 * @param {string} args.applyCreditMethod which method to use on the dibs_transaction instance, determined by credit type
 * @param {Object} args.dibsTransaction instance to apply credit on
 * @param {number} args.creditRemaining in the user's account
 * @param {number} args.totalCreditApplied so far in this checkout
 * @param {Object} args.sqlTransaction SQL transaction
 * @returns {Object} with new values to use in function below
 */
async function applyCreditToTransaction({
  credit,
  useLoadBonus,
  applyCreditMethod,
  dibsTransaction,
  creditRemaining,
  totalCreditApplied,
  sqlTransaction,
}) {
  const creditToApply = Math.min(
    +creditRemaining,
    Decimal(dibsTransaction.amount)
      .minus(dibsTransaction.studio_credits_spent)
      .minus(dibsTransaction.raf_credits_spent)
  );
  creditRemaining = Decimal(Math.max(+creditRemaining.minus(creditToApply), 0));
  totalCreditApplied = totalCreditApplied.plus(creditToApply);
  await dibsTransaction[applyCreditMethod](creditToApply, {
    save: true,
    transaction: sqlTransaction,
  });
  await credit.deductAmount(+creditToApply, {
    save: true,
    useLoadBonus,
    transaction: sqlTransaction,
    associatedTransactionId: dibsTransaction.id,
    creditTransactionType: models.credit_transaction.Types.CREDIT_APPLICATION,
  });
  return {
    dibsTransaction,
    creditRemaining,
    totalCreditApplied,
  };
}

/**
 * @param {Object} args named arguments
 * @param {string} args.itemType the key of the events cart to modify (which type of item)
 * @param {boolean} args.allowLoadBonus if true, will allow additional credit from credit loads to apply to purchase
 * @param {function} args.canApplyCreditFilter item specific test for if credit can apply (ex. for events its if the cart item has a passid)
 * @param {Object} args.cart current cart
 * @param {Object} args.credit credit instance to apply to checkout
 * @param {string} args.applyCreditMethod which method to use on the dibs_transaction instance, determined by credit type
 * @param {Object} args.sqlTransaction SQL transaction
 * @returns {Object} updated cart and credit instance
 */
async function applyCreditToCartItems({
  itemType,
  allowLoadBonus,
  canApplyCreditFilter = () => true,
  cart,
  credit,
  applyCreditMethod,
  sqlTransaction,
}) {
  if (!cart[itemType].length || !cart[itemType].some(canApplyCreditFilter)) return { cart, credit };
  let totalCreditApplied = Decimal(0);
  let creditRemaining = Decimal(credit.getAvailableBalance({ allowLoadBonus }));
  if (creditRemaining.equals(0)) return { cart, credit };
  const newCart = {
    ...cart,
    [itemType]: await Promise.mapSeries(cart[itemType], async ({ dibsTransaction, ...item }) => {
      if (canApplyCreditFilter(item) && dibsTransaction.amount && +creditRemaining) {
        ({
          dibsTransaction,
          creditRemaining,
          totalCreditApplied,
        } = await applyCreditToTransaction({
          credit,
          useLoadBonus: allowLoadBonus,
          applyCreditMethod,
          dibsTransaction,
          creditRemaining,
          totalCreditApplied,
          sqlTransaction,
        }));
      }
      return {
        ...item,
        dibsTransaction,
      };
    }, { concurrency: 1 }),
  };
  return { cart: newCart, credit };
}

/**
 * @param {string} type of credit to use
 * @param {Object} user instance who purchase is for
 * @param {Object} cart at checkout
 * @param {Object} sqlTransaction SQL transaction for atomic update
 * @returns {Object} cart after credits are applied
 */
async function applyCreditToCart(type, user, cart, sqlTransaction) {
  if (!(cart.packages.length + cart.events.length + cart.giftCards.length)) return cart;
  try {
    const dibsStudioId = cartHelpers.getCartDibsStudioId(cart);
    const applyCreditMethod = type === 'studio' ? 'applyStudioCredit' : 'applyRafCredit';
    let credit = await user.findCredit(type, dibsStudioId);
    if (!credit) return cart;
    ({ cart, credit } = await Promise.reduce(
      [
        ['packages', false],
        ['events', true, item => !item.passid],
        ['giftCards', true],
      ],
      (
        acc,
        [itemType, allowLoadBonus, canApplyCreditFilter]
      ) =>
        applyCreditToCartItems({
          itemType,
          allowLoadBonus,
          canApplyCreditFilter,
          applyCreditMethod,
          sqlTransaction,
          ...acc,
        }),
      { cart, credit }
    ));
    return cart;
  } catch (err) {
    throw new CreditApplicationError(type, err);
  }
}

module.exports = {
  /* eslint-disable global-require */
  queryCreditTiers: require('./query'),
  createOrUpdateCredit: require('./create-or-update-credits'),
  buildCreditDibsTransactions: require('./build-credit-dibs-transactions'),
  applyStudioCreditToCart: applyCreditToCart.bind(null, 'studio'),
  applyRAFCreditToCart: applyCreditToCart.bind(null, 'raf'),
};
