module.exports = function setStripeFee(stripeFee, { save = false, transaction = null } = {}) {
  this.stripe_fee = stripeFee;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
