import { getFormattedCreatedAt, getFormattedMonetaryValue, getFormattedDate } from './shared';

/**
 * @param {Object} flashCredit instance
 * @returns {Object} row data for the table components
 */
export default function getDetailedFlashCredit(flashCredit) {
    const formattedExpiration = getFormattedDate(flashCredit.expiration, flashCredit);
    const formattedCredit = getFormattedMonetaryValue(flashCredit.credit, flashCredit, { precision: 0 });
    const valuetoshow = 'N/A';
    return {
        tableRowData: [getFormattedCreatedAt(flashCredit), formattedCredit, formattedExpiration, Boolean(flashCredit.transaction)],
        expandedRowData: {
            label: 'Summary',
            summary: {
                heading: 'Flash Credit',
                items: [
                    `Awarded ${getFormattedDate(flashCredit.createdAt, flashCredit)}`,
                    flashCredit.transaction
                        ? `Used ${getFormattedDate(flashCredit.transaction.createdAt, flashCredit)}`
                        : `Expired ${formattedExpiration}`
                ]
            },
            breakdown: {
                total: formattedCredit,
                items: [
                    {
                        label: 'Applied To',
                        value: valuetoshow
                    }
                ]
            }
        }
    };
}
