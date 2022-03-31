module.exports = function success({ save = false, transaction = null } = {}) {
  this.status = 1;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
