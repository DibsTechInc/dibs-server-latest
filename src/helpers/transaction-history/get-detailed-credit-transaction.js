import { format as formatCurrency } from 'currency-formatter';
import Decimal from 'decimal.js';

import { CreditTransactionTypes } from 'shared/constants/TransactionHistoryConstants';
import { getFormattedCreatedAt, getTransactionItemName, getTransactionSummaryItems, getTransactionBreakdownItems } from './shared';

/**
 * @param {Object} creditTransaction instance
 * @returns {string} formatted amount of transaction
 */
export const getFormattedAmount = (creditTransaction) => {
    const creditDifference = Decimal(creditTransaction.after_credit).minus(creditTransaction.before_credit);
    return formatCurrency(creditDifference, { code: creditTransaction.studio.currency });
};

/**
 * @param {Object} creditTransaction instance
 * @returns {string} item transaction was for
 */
export const getCreditTransactionItemName = (creditTransaction) => {
    switch (creditTransaction.type) {
        case CreditTransactionTypes.SMART_PASS_AWARD:
            return 'Smart Pass Award';

        case CreditTransactionTypes.CLASS_DROP:
            return `Dropped ${getTransactionItemName(creditTransaction.transaction)}`;

        case CreditTransactionTypes.CREDIT_LOAD:
            return 'Credit Load';

        case CreditTransactionTypes.REFER_A_FRIEND:
            return 'Refer a Friend';

        case CreditTransactionTypes.COMP:
            return 'Comp';

        case CreditTransactionTypes.CREDIT_APPLICATION:
            return getTransactionItemName(creditTransaction.transaction);

        case CreditTransactionTypes.REFUND:
            return `Refunded ${getTransactionItemName(creditTransaction.transaction)}`;

        default:
            return null;
    }
};

/**
 * @param {Object} creditTransaction instance
 * @returns {Object} data for transaction history
 */
export default function getDetailedCreditTransaction(creditTransaction) {
    console.log(`getDetailedCreditTransaction: ${JSON.stringify(creditTransaction)}`);
    return {
        tableRowData: [
            getFormattedCreatedAt(creditTransaction),
            getCreditTransactionItemName(creditTransaction),
            getFormattedAmount(creditTransaction)
        ],
        expandedRowData: {
            label: 'Summary',
            summary: {
                heading: getCreditTransactionItemName(creditTransaction),
                items: creditTransaction.transaction ? getTransactionSummaryItems(creditTransaction.transaction) : []
            },
            breakdown: {
                total:
                    (creditTransaction.type === CreditTransactionTypes.CREDIT_APPLICATION ? '-' : '+') +
                    getFormattedAmount(creditTransaction),
                items: creditTransaction.transaction ? getTransactionBreakdownItems(creditTransaction.transaction) : []
            }
        }
    };
}
