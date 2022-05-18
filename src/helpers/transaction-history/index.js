import mapTransactionTypeToPathname from './map-transaction-type-to-pathname';
import { TransactionHistorySections } from 'shared/constants/TransactionHistoryConstants';

import getDetailedPurchase from './get-detailed-purchase';
import getDetailedPack from './get-detailed-pack';
import getDetailedFlashCredit from './get-detailed-flash-credit';
import getDetailedCreditTransaction from './get-detailed-credit-transaction';
import getDetailedEventTransaction from './get-detailed-event-transaction';

export { default as mapTransactionTypeToPathname } from './map-transaction-type-to-pathname';
export { default as applyTransactionTableTextFilter } from './apply-text-filter';

/**
 * @param {string} pathname of current route for transaction history
 * @returns {function} map for selectors from raw data to data formatted for table
 */
export function transactionDataMaps(pathname) {
    return mapTransactionTypeToPathname({
        [TransactionHistorySections.PURCHASES]: getDetailedPurchase,

        [TransactionHistorySections.AVAILABLE_PACKS]: getDetailedPack,

        [TransactionHistorySections.UNAVAILABLE_PACKS]: getDetailedPack,

        [TransactionHistorySections.FLASH_CREDIT]: getDetailedFlashCredit,

        [TransactionHistorySections.CREDIT]: getDetailedCreditTransaction,

        [TransactionHistorySections.PAST_CLASSES]: (transaction, { ...opts } = {}) =>
            getDetailedEventTransaction(transaction, { ...opts, dropped: false }),

        [TransactionHistorySections.UPCOMING_CLASSES]: (transaction, { ...opts } = {}) =>
            getDetailedEventTransaction(transaction, { ...opts, dropped: false }),

        [TransactionHistorySections.DROPPED_CLASSES]: (transaction, { ...opts } = {}) =>
            getDetailedEventTransaction(transaction, { ...opts, dropped: true }),

        [TransactionHistorySections.PACK_BREAKDOWN]: (transaction, { ...opts } = {}) =>
            getDetailedEventTransaction(transaction, { ...opts, passBreakdown: true }),

        default: () => ({})
    })(pathname);
}
