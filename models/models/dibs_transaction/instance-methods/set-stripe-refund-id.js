module.exports = function setStripeRefundId(refundId, { save = false, transaction = null } = {}) {
  this.stripe_refund_id = refundId;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
