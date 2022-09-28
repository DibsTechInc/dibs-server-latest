const shared = require('./shared');

module.exports = function queryTransactions(where) {
  return models.dibs_transaction.findAll({
    where,
    include: shared.getTransactionsSQLInclude(),
  });
};
