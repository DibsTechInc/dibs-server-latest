const Enum = require('enum');

const EarlyDropOverrideValues = new Enum([
  'NONE',
  'EARLY',
  'LATE',
]);

const ReturnCreditOverrideValues = new Enum([
  'NONE',
  'FORFEIT',
  'RETURN',
]);

module.exports = {
  EarlyDropOverrideValues,
  ReturnCreditOverrideValues,
};
