const enums = require('./enums');

/**
 * @param {boolean} early is this an early drop
 * @param {enum} returnCreditOverride customizable for studio admin
 * @returns {boolean} if credit should be returned from this drop
 */
module.exports = function shouldReturnCredit({ early, returnCreditOverride }) {
  const earlyAndNotForfeit = early && returnCreditOverride !== enums.ReturnCreditOverrideValues.FORFEIT;
  const forceReturn = returnCreditOverride === enums.ReturnCreditOverrideValues.RETURN;
  return earlyAndNotForfeit || forceReturn;
};
