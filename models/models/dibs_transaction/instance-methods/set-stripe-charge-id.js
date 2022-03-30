module.exports = function setStripeChargeId(chargeId, { save = false, transaction = null } = {}) {
  this.stripe_charge_id = chargeId;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
