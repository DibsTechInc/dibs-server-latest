import PropTypes from 'prop-types';

export const TRANSACTION_HISTORY_BASE_PATH = 'transactions';

export const TransactionHistorySections = {
    PURCHASES: 'purchases',
    FLASH_CREDIT: 'flash',
    CREDIT: 'credit',
    PAST_CLASSES: 'past',
    UPCOMING_CLASSES: 'upcoming',
    DROPPED_CLASSES: 'dropped',
    AVAILABLE_PACKS: 'available-packs',
    UNAVAILABLE_PACKS: 'unavailable-packs',
    PACK_BREAKDOWN: 'packs'
};

export const PurchaseTransactionTypes = {
    CLASS: 'class',
    CREDIT: 'cred',
    GIFT_CARD: 'gift',
    CHARITY_DONATION: 'chrty',
    WAITLIST: 'wait',
    PACKAGE: 'pack',
    RETAIL: 'retail'
};

export const CreditTransactionTypes = {
    SMART_PASS_AWARD: 'smart_pass_award',
    CLASS_DROP: 'class_drop',
    CREDIT_LOAD: 'credit_load',
    REFER_A_FRIEND: 'refer_a_friend',
    COMP: 'comp',
    CREDIT_APPLICATION: 'credit_application',
    REFUND: 'refund'
};

export const TransactionRefundReasons = {
    DUPLICATE: 'duplicate',
    FRAUDULENT: 'fraudulent',
    REQUESTED_BY_CUSTOMER: 'requested_by_customer'
};

export const TRANSACTION_HISTORY_DATA_TYPE = PropTypes.arrayOf(
    PropTypes.shape({
        tableRowData: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number, PropTypes.element, PropTypes.shape()])
        ),
        expandedRowData: PropTypes.shape()
    })
);
