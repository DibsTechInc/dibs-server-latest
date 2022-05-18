import Decimal from 'decimal.js';

import {
    getFormattedCreatedAt,
    getTransactionItemName,
    getFormattedChargeAmount,
    getFormattedMonetaryValue,
    getTransactionBreakdown,
    getTransactionSummaryItems
} from './shared';

/**
 * @param {Object} transaction dibs_transaction dataValues with associated model instances
 * @returns {Object} detailed transaction for selectors
 */
export default function getDetailedPurchase(transaction, { isStudioAdmin = false } = {}) {
    const chargeAmount = getFormattedChargeAmount(transaction);
    const creditsSpent = +Decimal(transaction.studio_credits_spent).plus(transaction.raf_credits_spent);
    const tableRowData = [getFormattedCreatedAt(transaction), getTransactionItemName(transaction), chargeAmount];
    if (isStudioAdmin) {
        tableRowData.push({
            // props for refund button
            id: transaction.id,
            chargeAmount,
            refunded: Boolean(transaction.stripe_refund_id),
            creditsSpent: creditsSpent ? getFormattedMonetaryValue(creditsSpent, transaction) : null,
            disabled: Boolean(!transaction.stripe_charge_id || transaction.stripe_refund_id || transaction.deletedAt)
        });
    }
    return {
        tableRowData,
        expandedRowData: {
            label: 'Purchase Summary',
            summary: {
                heading: getTransactionItemName(transaction),
                items: getTransactionSummaryItems(transaction)
            },
            breakdown: getTransactionBreakdown(transaction),
            passid: transaction.passPurchased ? transaction.passPurchased.id : null
        }
    };
}
