module.exports = function amendDescription(addendum, { save = false, transaction = null } = {}) {
  this.description += ` | ${addendum}`;
  if (!save) return this;
  return this.save(transaction ? { transaction } : undefined);
};
