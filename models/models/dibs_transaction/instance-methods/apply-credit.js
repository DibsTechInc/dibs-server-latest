module.exports = function applyCredit(type, creditAmount, { save = false, transaction = null } = {}) {
  if (isNaN(creditAmount)) throw new Error('You must use a numeric value for applying credit to a dibs_transaction');
  this[`${type}_credits_spent`] = Math.min(this.amount, +creditAmount);
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
