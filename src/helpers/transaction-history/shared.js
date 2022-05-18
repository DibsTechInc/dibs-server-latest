import moment from 'moment-timezone';
import { format as formatCurrency } from 'currency-formatter';
import Decimal from 'decimal.js';

import { PurchaseTransactionTypes } from 'shared/constants/TransactionHistoryConstants';

/**
 * @param {Object} transaction instance
 * @returns {Object} studio transaction is for
 */
function getStudio(transaction) {
    return transaction.dibs_studio || transaction.studio;
}

/**
 * @param {Object} transaction to get item name for
 * @returns {string} item name
 */
export function getTransactionItemName(transaction) {
    switch (transaction.type) {
        case PurchaseTransactionTypes.CLASS:
        case PurchaseTransactionTypes.WAITLIST:
            return transaction.event.name;

        case PurchaseTransactionTypes.CREDIT:
            return 'Credit Load';

        case PurchaseTransactionTypes.GIFT_CARD:
            return 'Gift Card';

        case PurchaseTransactionTypes.PACKAGE:
            return transaction.passPurchased.studioPackage.name;

        case PurchaseTransactionTypes.RETAIL:
            if (transaction.retail !== null) return transaction.retail.name;
            return 'Retail Item';

        default:
            return null;
    }
}

/**
 * @param {string|Date} date to format
 * @param {Object} transaction to format date for
 * @param {string} defaultText if date value is falsey
 * @returns {string} formatted date
 */
export function getFormattedDate(date, transaction, defaultText = 'N/A') {
    if (!date) return defaultText;
    return moment(date).format(getStudio(transaction).country === 'US' ? 'M/D/YY' : 'D/M/YY');
}

/**
 * @param {Object} transaction to get purchase date of
 * @returns {string} formatted purchase date
 */
export function getFormattedCreatedAt(transaction) {
    return getFormattedDate(transaction.createdAt, transaction);
}

/**
 * @param {number|string} value to format
 * @param {Object} transaction to get purchase date of
 * @returns {string} formatted monetary value amount
 */
export function getFormattedMonetaryValue(value, transaction, { precision = 2 } = {}) {
    return formatCurrency(value, { code: getStudio(transaction).currency, precision });
}

/**
 * @param {Object} transaction to get purchase date of
 * @returns {Object} formatted charge amount
 */
export function getFormattedChargeAmount(transaction) {
    return getFormattedMonetaryValue(transaction.chargeAmount, transaction);
}

/**
 * @param {string|Date|moment} time to format
 * @param {Object} transaction instance to base formatting on
 * @param {string} [defaultText='N/A'] what it returns if time is falsey
 * @returns {string} formatted time
 */
export function getFormattedTime(time, transaction, defaultText = 'N/A') {
    if (!time) return defaultText;
    return moment(time).format(getStudio(transaction).dibs_config.customTimeFormat || 'h:mm a');
}

/**
 * @param {Object} eventTransaction transaction for class
 * @returns {Object} moment object with event time in studio tz
 */
export function getEventTimeInStudioTimezone(eventTransaction) {
    return moment.tz(moment.utc(eventTransaction.event.start_date).format('YYYY-MM-DDTHH:mm:ss'), eventTransaction.dibs_studio.mainTZ);
}

/**
 * @param {Object} transaction package purchase transaction
 * @returns {Array<string>} summary items
 */
export function getPackTransactionSummaryItems(transaction) {
    switch (true) {
        case moment(transaction.passPurchased.expiresAt).isAfter(moment()) && transaction.passPurchased.studioPackage.unlimited:
            return [
                `Expires ${getFormattedDate(transaction.passPurchased.expiresAt, transaction)}`,
                'Unlimited',
                `Transaction ID: ${transaction.id}`
            ];

        case transaction.passPurchased.studioPackage.unlimited:
            return ['Expired', 'Unlimited', `Transaction ID: ${transaction.id}`];

        case moment(transaction.passPurchased.expiresAt).isAfter(moment()) &&
            transaction.passPurchased.usesCount < transaction.passPurchased.totalUses:
            return [
                `Expires ${getFormattedDate(transaction.passPurchased.expiresAt, transaction)}`,
                `${transaction.passPurchased.totalUses - transaction.passPurchased.usesCount} Uses Left`,
                `Transaction ID: ${transaction.id}`
            ];

        case transaction.passPurchased.usesCount < transaction.passPurchased.totalUses:
            return [
                'Expired',
                `${transaction.passPurchased.totalUses - transaction.passPurchased.usesCount} Uses Left`,
                `Transaction ID: ${transaction.id}`
            ];

        case moment(transaction.passPurchased.expiresAt).isAfter(moment()):
            return [
                `Expires ${getFormattedDate(transaction.passPurchased.expiresAt, transaction)}`,
                'No more uses',
                `Transaction ID: ${transaction.id}`
            ];

        default:
            return ['Expired', 'No more uses', `Transaction ID: ${transaction.id}`];
    }
}

/**
 * @param {Object} transaction to show summary items for
 * @returns {Array<string>} summary items for expanded table row
 */
export function getEventTransactionSummaryItems(transaction) {
    const { firstname, lastname } = transaction.event.instructor;
    const eventStartInStudioTZ = getEventTimeInStudioTimezone(transaction);
    const formattedDate = getFormattedDate(eventStartInStudioTZ, transaction);
    const formattedTime = getFormattedTime(eventStartInStudioTZ, transaction);
    return [
        `${formattedDate} ${formattedTime}`,
        transaction.event.location.name,
        `${firstname} ${lastname}`,
        `Transaction ID: ${transaction.id}`
    ];
}

/**
 * @param {Object} transaction instance to break down
 * @returns {Array<Object>} transaction breakdown items for expanded row
 */
export function getTransactionBreakdownItems(transaction) {
    const items = [
        {
            label: 'Base Cost',
            value: `+${getFormattedMonetaryValue(transaction.original_price, transaction)}`
        }
    ];
    if (transaction.pass) {
        items.push({
            label: `${transaction.pass.studioPackage.name}${transaction.unpaid ? ' (Unpaid)' : ''}`,
            value: `-${getFormattedMonetaryValue(
                transaction.pass.passValue ? Math.max(transaction.pass.passValue, transaction.original_price) : transaction.original_price,
                transaction
            )}`
        });
    }
    if (transaction.tax_amount) {
        items.push({
            label: 'Tax',
            value: `+${getFormattedMonetaryValue(+Decimal(transaction.tax_amount), transaction)}`
        });
    }
    if (transaction.flashCredit) {
        items.push({
            label: 'Flash Credit',
            value: `-${getFormattedMonetaryValue(+Decimal(transaction.flashCredit.credit), transaction)}`
        });
    }
    if (transaction.promoid) {
        items.push({
            label: 'Promo Code',
            value: `-${getFormattedMonetaryValue(
                +Decimal(transaction.discount_amount).minus(transaction.flashCredit ? transaction.flashCredit.credit : 0),
                transaction
            )}`
        });
    }
    if (transaction.studio_credits_spent) {
        items.push({
            label: 'Studio Credits',
            value: `-${getFormattedMonetaryValue(+Decimal(transaction.studio_credits_spent), transaction)}`
        });
    }
    if (transaction.raf_credits_spent) {
        items.push({
            label: 'RAF Credits',
            value: `-${getFormattedMonetaryValue(+Decimal(transaction.raf_credits_spent), transaction)}`
        });
    }
    if (transaction.global_credits_spent) {
        items.push({
            label: 'Global Credits',
            value: `-${getFormattedMonetaryValue(+Decimal(transaction.global_credits_spent), transaction)}`
        });
    }
    if (
        transaction.pass &&
        transaction.pass.passValue &&
        transaction.smart_pass_awarded &&
        (transaction.pass.passValue > transaction.original_price || transaction.discount_amount)
    ) {
        items.push({
            label: 'Credit Awarded',
            value: `+${getFormattedMonetaryValue(
                +Decimal(Math.max(+Decimal(transaction.pass.passValue).minus(transaction.original_price), 0)).plus(
                    transaction.discount_amount
                ),
                transaction
            )}`
        });
    }
    return items;
}

/**
 * @param {Object} transaction instance
 * @returns {Object} transaction breakdown for purchase
 */
export function getTransactionBreakdown(transaction) {
    const breakdown = {
        total: getFormattedMonetaryValue(transaction.chargeAmount, transaction),
        items: getTransactionBreakdownItems(transaction)
    };
    return breakdown;
}

/**
 * @param {Object} transaction instance
 * @returns {Arra<string>} summary items for the left column of expanded row
 */
export function getTransactionSummaryItems(transaction) {
    switch (transaction.type) {
        case PurchaseTransactionTypes.CLASS:
        case PurchaseTransactionTypes.WAITLIST:
            return getEventTransactionSummaryItems(transaction);

        case PurchaseTransactionTypes.PACKAGE:
            return getPackTransactionSummaryItems(transaction);

        default:
            return [`Transaction ID: ${transaction.id}`];
    }
}
