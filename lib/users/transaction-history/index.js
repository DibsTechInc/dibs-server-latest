const getPurchases = require('./get-purchases');
const getPacks = require('./get-packs');
const getFlashCredits = require('./get-flash-credits');
const getCreditTransactions = require('./get-credit-transactions');
const getEventTransactions = require('./get-event-transactions');
const getPackageNameFromPassid = require('./get-pack-name-from-passid');
const { TransactionHistorySections } = require('../constants');

/**
 * @param {Object} user instance
 * @param {number} dibsStudioID of studio for transactions
 * @param {number} passid of pack breakdown
 * @returns {Object} data for API transactions response
 */
async function getPackBreakdown({ user, dibsStudioId, passid }) {
    const data = await getEventTransactions({ user, dibsStudioId, passid });
    return {
        data,
        packageName: await getPackageNameFromPassid(passid, data)
    };
}

module.exports = async function getTransactionHistory(userid, { type, dibsStudioId, passid } = {}) {
    console.log(`type is: ${type}`);
    switch (type) {
        case TransactionHistorySections.PURCHASES:
            return { data: await getPurchases({ userid, dibsStudioId }) };

        case TransactionHistorySections.AVAILABLE_PACKS:
            return { data: await getPacks({ userid, dibsStudioId, available: true }) };

        case TransactionHistorySections.UNAVAILABLE_PACKS:
            return { data: await getPacks({ userid, dibsStudioId, available: false }) };

        case TransactionHistorySections.FLASH_CREDIT:
            return { data: await getFlashCredits({ userid, dibsStudioId }) };

        case TransactionHistorySections.CREDIT:
            return { data: await getCreditTransactions({ userid, dibsStudioId }) };

        case TransactionHistorySections.UPCOMING_CLASSES:
            return { data: await getEventTransactions({ userid, dibsStudioId, upcoming: true }) };

        case TransactionHistorySections.DROPPED_CLASSES:
            return { data: await getEventTransactions({ userid, dibsStudioId, dropped: true }) };

        case TransactionHistorySections.PAST_CLASSES:
            return { data: await getEventTransactions({ userid, dibsStudioId }) };

        case TransactionHistorySections.PACK_BREAKDOWN:
            return getPackBreakdown({ userid, dibsStudioId, passid });

        default:
            throw new Error('Invalid request paramater :type');
    }
};
