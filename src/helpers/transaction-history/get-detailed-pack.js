import {
  getFormattedCreatedAt,
  getFormattedDate,
  getFormattedChargeAmount,
  getPackTransactionSummaryItems,
  getTransactionBreakdown,
} from './shared';

/**
 * @param {Object} transaction package purchase transaction
 * @returns {string} uses left on pack
 */
function getPackUsesLeft(transaction) {
  if (transaction.passPurchased.studioPackage.unlimited) return 'Unlimited';
  return String(transaction.passPurchased.totalUses - transaction.passPurchased.usesCount);
}

/**
 * @param {Object} transaction package dibs_transaction dataValues with associated model instances
 * @returns {Object} detailed transaction for selectors
 */
export default function getDetailedPack(transaction) {
  return {
    tableRowData: [
      getFormattedCreatedAt(transaction),
      transaction.passPurchased.studioPackage.name,
      getFormattedDate(transaction.passPurchased.expiresAt, transaction, 'Expiration Not Set'),
      getFormattedChargeAmount(transaction),
      getPackUsesLeft(transaction),
    ],
    expandedRowData: {
      label: 'Purchase Summary',
      summary: {
        heading: transaction.passPurchased.studioPackage.name,
        items: getPackTransactionSummaryItems(transaction),
      },
      breakdown: getTransactionBreakdown(transaction),
      passid: transaction.passPurchased.id,
    },
  };
}

// TODO add amount earned from pass in package breakdown
