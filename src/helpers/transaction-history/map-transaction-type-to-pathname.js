import { TransactionHistorySections, TRANSACTION_HISTORY_BASE_PATH } from 'shared/constants/TransactionHistoryConstants';

/**
 * @param {string} section of the transaction history
 * @returns {RegExp} regular expression to match
 */
function getRegExpFromSection(section) {
    let regexStr = `\\/${TRANSACTION_HISTORY_BASE_PATH}`; // base path
    regexStr += `\\/${section}`; // section path
    if (section === TransactionHistorySections.PACK_BREAKDOWN) {
        regexStr += '\\/\\d+'; // any integer
    }
    regexStr += '\\/?'; // can have slash at the end
    regexStr += '(\\?.*)?'; // can have any query string (for now)
    regexStr += '$';
    return new RegExp(regexStr, 'i');
}

const regularExpressions = {};

// eslint-disable-next-line no-return-assign
Object.values(TransactionHistorySections).forEach((section) => (regularExpressions[section] = getRegExpFromSection(section)));

const transactionHistorySectionMapTests = {};

Object.values(TransactionHistorySections).forEach(
    // eslint-disable-next-line no-return-assign
    (section) => (transactionHistorySectionMapTests[section] = (pathname) => pathname && regularExpressions[section].test(pathname))
);

const {
    PURCHASES,
    FLASH_CREDIT,
    CREDIT,
    UPCOMING_CLASSES,
    PAST_CLASSES,
    DROPPED_CLASSES,
    AVAILABLE_PACKS,
    UNAVAILABLE_PACKS,
    PACK_BREAKDOWN
} = TransactionHistorySections;

/**
 * @param {Object} object map from TransactionHistorySections types to any other JS object
 * @returns {function} functional map to the correct key in the object using String.includes
 */
export default function mapTransactionTypeToPathname(object) {
    return (pathname) => {
        const matches = (section) => transactionHistorySectionMapTests[section](pathname); // returns true if current path passes section's regex test
        switch (true) {
            case matches(PURCHASES):
                return object[TransactionHistorySections.PURCHASES] || object.default;

            case matches(FLASH_CREDIT):
                return object[TransactionHistorySections.FLASH_CREDIT] || object.default;

            case matches(CREDIT):
                return object[TransactionHistorySections.CREDIT] || object.default;

            case matches(UPCOMING_CLASSES):
                return object[TransactionHistorySections.UPCOMING_CLASSES] || object.default;

            case matches(PAST_CLASSES):
                return object[TransactionHistorySections.PAST_CLASSES] || object.default;

            case matches(DROPPED_CLASSES):
                return object[TransactionHistorySections.DROPPED_CLASSES] || object.default;

            case matches(AVAILABLE_PACKS):
                return object[TransactionHistorySections.AVAILABLE_PACKS] || object.default;

            case matches(UNAVAILABLE_PACKS):
                return object[TransactionHistorySections.UNAVAILABLE_PACKS] || object.default;

            case matches(PACK_BREAKDOWN):
                return object[TransactionHistorySections.PACK_BREAKDOWN] || object.default;

            default:
                return object.default;
        }
    };
}
