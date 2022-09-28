const Decimal = require('decimal.js');

/**
 *
 * @param {Number} runningTotal  - current amount
 * @param {Number} totalCredits  - value of credits
 * @returns {Object} amount of credits to apply and updated amount of credits
 */
module.exports = function applyCredit(runningTotal, totalCredits) {
    const creditsToApply = Math.min(runningTotal, totalCredits);
    const newCreditAmount = Decimal(totalCredits).minus(creditsToApply).toNumber();
    return {
        creditsToApply,
        newCreditAmount
    };
};
