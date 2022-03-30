module.exports = function assignSaleId(saleid, { save = false, transaction = null } = {}) {
  this.saleid = saleid;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};