module.exports = function setMinChargeAdjustment(amount, { save = false, transaction = null } = {}) {
  this.min_charge_adj = amount;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
