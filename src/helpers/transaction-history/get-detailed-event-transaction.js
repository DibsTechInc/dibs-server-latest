import moment from 'moment-timezone';

import {
    getFormattedDate,
    getFormattedMonetaryValue,
    getEventTransactionSummaryItems,
    getTransactionBreakdown,
    getEventTimeInStudioTimezone,
    getFormattedTime
} from './shared';

/**
 * @param {Object} transaction instance
 * @param {Object} options optional params
 * @returns {Object} formatted data for the history table
 */
export default function getDetailedEventTransaction(
    transaction,
    { isStudioAdmin = false, clientName = '', dropped = false, passBreakdown = false } = {}
) {
    const eventStartInStudioTZ = getEventTimeInStudioTimezone(transaction);
    const { instructor } = transaction.event;
    // console.log(`isStudioAdmin = ${isStudioAdmin}`);

    let paymentMethod;
    switch (true) {
        case Boolean(transaction.pass):
            paymentMethod = transaction.pass.studioPackage.name;
            break;

        case Boolean(transaction.chargeAmount):
            paymentMethod = getFormattedMonetaryValue(transaction.chargeAmount, transaction);
            break;

        case Boolean(transaction.studio_credits_spent || transaction.global_credits_spent || transaction.raf_credits_spent):
            paymentMethod = 'Credit';
            break;

        default:
            paymentMethod = 'No Charge';
    }

    const tableRowData = [
        getFormattedDate(eventStartInStudioTZ, transaction),
        getFormattedTime(eventStartInStudioTZ, transaction),
        transaction.event.name,
        `${instructor.firstname} ${instructor.lastname}`
    ];

    if (passBreakdown) tableRowData.push(Boolean(transaction.deletedAt));
    else if (!dropped) tableRowData.push(paymentMethod);

    if (!passBreakdown) {
        const buttonProps = {
            id: transaction.id,
            usedPass: Boolean(transaction.with_passid),
            packageName: transaction.with_passid && transaction.pass.studioPackage.name,
            creditAmount: getFormattedMonetaryValue(transaction.amount, transaction)
        };
        if (dropped) {
            buttonProps.disabled = Boolean(transaction.early_cancel);
        } else {
            buttonProps.earlyDrop = eventStartInStudioTZ.isAfter(moment().add(transaction.dibs_studio.cancel_time, 'h'));
            buttonProps.eventName = transaction.event.name;
            buttonProps.clientName = clientName;
        }
        tableRowData.push(buttonProps);
    } else if (!passBreakdown && dropped) {
        tableRowData.push(Boolean(transaction.early_cancel));
    }

    return {
        tableRowData,
        expandedRowData: {
            label: 'Purchase Summary',
            summary: {
                heading: transaction.event.name,
                items: getEventTransactionSummaryItems(transaction)
            },
            breakdown: getTransactionBreakdown(transaction)
        }
    };
}
