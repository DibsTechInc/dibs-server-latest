const Enum = require('enum');

/**
 * We must refund according to how we charged
 * PLATFORM - charge was on the platform account with no destination
 * PLATFORM_REVERSE_TRANSFER - charge was on the platform account with a destination
 * MANAGED_ACCOUNT - charge was on the managed account
 * */
const RefundTypes = new Enum(['PLATFORM', 'PLATFORM_REVERSE_TRANSFER', 'MANAGED_ACCOUNT']);

const USD_STRIPE_FEE_PERECENTAGE = 0.029;
const USD_STRIPE_FEE_FIXED = 0.3;

const GBP_EURO_CARD_STRIPE_FEE_PERCENTAGE = 0.014;
const GBP_NON_EURO_CARD_STRIPE_FEE_PERCENTAGE = 0.029;
const GBP_STRIPE_FEE_FIXED = 0.2;

const MIN_CHARGE_ADJUSTMENT_CUTOFF = 0.5;

module.exports = {
    USD_STRIPE_FEE_PERECENTAGE,
    USD_STRIPE_FEE_FIXED,

    GBP_EURO_CARD_STRIPE_FEE_PERCENTAGE,
    GBP_NON_EURO_CARD_STRIPE_FEE_PERCENTAGE,
    GBP_STRIPE_FEE_FIXED,

    MIN_CHARGE_ADJUSTMENT_CUTOFF,
    RefundTypes
};
