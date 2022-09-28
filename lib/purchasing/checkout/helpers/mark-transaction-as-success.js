/**
 * @param {Object} sqlTransaction SQL transaction
 * @param {Object} item in cart (any type)
 * @returns {Object} item with transaction marked as success
 */
module.exports = async function markTransactionsAsSuccess(sqlTransaction, item) {
  return {
    ...item,
    dibsTransaction: await item.dibsTransaction.success({
      save: true,
      transaction: sqlTransaction,
    }),
  };
};
