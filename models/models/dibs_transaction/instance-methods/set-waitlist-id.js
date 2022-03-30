module.exports = function setWaitlistId(waitlistId, { save = false, transaction = null } = {}) {
  this.waitlist_id = waitlistId;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
