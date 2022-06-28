const express = require('express');

const getStudioEmployeeInfo = require('./studio/get-studio-employee-info');
const getDashboardData = require('./studio/get-dashboard-data');
const getEarliestRevenueYear = require('./studio/get-earliest-revenue-year');
const getDashboardSalesGrowthData = require('./studio/get-dashboard-sales-growth-data');
const findOrCreateStripeCustomer = require('./studio/find-or-create-stripe-customer');
const getClientSearchResults = require('./studio/get-client-search-results');
const getClientInfo = require('./studio/get-client-info');
const stripeSetupIntent = require('./studio/stripe-setup-intent');
const stripeStudioSetupIntent = require('./studio/stripe-setup-studio-intent');
const stripeGetPaymentMethods = require('./studio/stripe-get-payment-methods');
const stripeGetStudioPaymentMethods = require('./studio/stripe-get-studio-payment-methods');
const getFormattedPayouts = require('./studio/payouts/get-payouts');
const updateClientInfo = require('./studio/update-client-info');
const getNumberVisits = require('./studio/get-number-visits');
const getUpcomingClasses = require('./studio/get-client-upcoming-classes');
const getAvailablePasses = require('./studio/get-client-available-passes');
const getClientNotes = require('./studio/get-client-notes');
const getClientCredit = require('./studio/get-client-credit');
const getUserTransactions = require('./studio/user/get-transactions');
const getRetailProducts = require('./studio/retail/get-retail-products');
const getStudioEvents = require('./studio/calendar/get-events-new');
const getIntegrationStatus = require('./studio/settings/get-integration-status');
const getDynamicPricingStatus = require('./studio/settings/get-dynamic-pricing-status');
const updateDynamicPricingStatus = require('./studio/settings/update-dynamic-pricing-status');
const updateFlashCreditStatus = require('./studio/settings/update-flash-credit-status');
const getFlashCreditStatus = require('./studio/settings/get-flash-credit-status');
const getPriceData = require('./studio/settings/get-price-min-max');
const updateGlobalPricingMinMax = require('./studio/settings/update-global-price-settings');
const getGeneralLocationData = require('./studio/settings/get-general-location-data');
const updateGeneralLocationData = require('./studio/settings/update-general-location-data');
const updateSendingDomain = require('./studio/settings/update-sending-domain');
const updateStudioAddress = require('./studio/settings/update-studio-address-data');
const getGeneralConfigData = require('./studio/settings/get-general-config-data');
const updateStudioColor = require('./studio/settings/update-studio-color');
const updateCalendarInterval = require('./studio/settings/update-calendar-interval');
const updateRafAward = require('./studio/settings/update-raf-award');
const updateCancelTime = require('./studio/settings/update-cancel-time');
const updateTaxRates = require('./studio/settings/update-tax-rate-data');
const updateStudioProfileAccount = require('./studio/account-profile/update-profile-account');
const getStripePublishableKey = require('./studio/get-stripe-publishable-key');
const updateBillingContact = require('./studio/account-profile/update-billing-contact');
const createNewEmployeeAccount = require('./studio/account-profile/create-new-employee-account');
const getEmployeeAccounts = require('./studio/account-profile/get-employee-accounts');
const updateEmployeeAccount = require('./studio/account-profile/update-employee-account');
const deactivateEmployeeAccount = require('./studio/account-profile/deactivate-employee-account');
const reactivateEmployeeAccount = require('./studio/account-profile/reactivate-employee-account');
const getInstructors = require('./studio/instructors/get-instructors-info');
const deactivateInstructor = require('./studio/instructors/deactivate-instructor');
const reactivateInstructor = require('./studio/instructors/reactivate-instructor');
const updateInstructorInfo = require('./studio/instructors/update-instructor-info');
const createNewInstructor = require('./studio/instructors/create-new-instructor');
const checkCode = require('./studio/promo-codes/check-code-exists');
const createNewPromoCode = require('./studio/promo-codes/create-new-promocode');
const getActivePromoCodes = require('./studio/promo-codes/get-active-promocodes');
const deactivatePromoCode = require('./studio/promo-codes/deactivate-promocode');

const router = express();

router.post('/login-studio-admin', getStudioEmployeeInfo);
router.post('/get-dashboard-data', getDashboardData);
router.post('/get-earliest-revenue-year', getEarliestRevenueYear);
router.post('/get-dashboard-sales-growth-data', getDashboardSalesGrowthData);
router.post('/find-or-create-stripe-customer', findOrCreateStripeCustomer);
router.post('/get-client-search-results', getClientSearchResults);
router.post('/get-client-info', getClientInfo);
router.post('/stripe-setup-intent', stripeSetupIntent);
router.post('/stripe-setup-studio-intent', stripeStudioSetupIntent);
router.post('/stripe-get-payment-methods', stripeGetPaymentMethods);
router.post('/stripe-get-studio-payment-methods', stripeGetStudioPaymentMethods);
router.post('/studio/get-payouts', getFormattedPayouts);
router.post('/get-stripe-publishable-key', getStripePublishableKey);
router.post('/update-client-info', updateClientInfo);
router.post('/get-number-visits', getNumberVisits);
router.post('/get-upcoming-classes', getUpcomingClasses);
router.post('/get-available-passes', getAvailablePasses);
router.post('/get-client-notes', getClientNotes);
router.post('/get-client-credit', getClientCredit);
router.post('/transactions/:type', getUserTransactions);
router.post('/studio/retail/get-retail-products', getRetailProducts);
router.post('/studio/calendar/events', getStudioEvents);
router.post('/studio/settings/integrations', getIntegrationStatus);
router.post('/studio/settings/dynamic-pricing', getDynamicPricingStatus);
router.post('/studio/settings/dynamic-pricing/update', updateDynamicPricingStatus);
router.post('/studio/settings/flash-credit/update', updateFlashCreditStatus);
router.post('/studio/settings/flash-credits', getFlashCreditStatus);
router.post('/studio/settings/price-data', getPriceData);
router.post('/studio/settings/global-price-settings/update', updateGlobalPricingMinMax);
router.post('/studio/settings/general-location-data', getGeneralLocationData);
router.post('/studio/settings/general-location-data/update', updateGeneralLocationData);
router.post('/studio/settings/sending-domain/update', updateSendingDomain);
router.post('/studio/settings/address/update', updateStudioAddress);
router.post('/studio/settings/general-config-data', getGeneralConfigData);
router.post('/studio/settings/update-studio-color', updateStudioColor);
router.post('/studio/settings/update-calendar-interval', updateCalendarInterval);
router.post('/studio/settings/update-raf-award', updateRafAward);
router.post('/studio/settings/update-cancel-time', updateCancelTime);
router.post('/studio/settings/update-tax-rates', updateTaxRates);
router.post('/studio/account/update-profile', updateStudioProfileAccount);
router.post('/studio/account/update-billing-contact', updateBillingContact);
router.post('/studio/account/create-new-employee', createNewEmployeeAccount);
router.post('/studio/account/get-employee-accounts', getEmployeeAccounts);
router.post('/studio/account/update-employee-account', updateEmployeeAccount);
router.post('/studio/account/deactivate-employee-account', deactivateEmployeeAccount);
router.post('/studio/account/reactivate-employee-account', reactivateEmployeeAccount);
router.post('/studio/instructors/get-instructors', getInstructors);
router.post('/studio/instructors/activate', reactivateInstructor);
router.post('/studio/instructors/deactivate', deactivateInstructor);
router.post('/studio/instructors/update', updateInstructorInfo);
router.post('/studio/instructors/create', createNewInstructor);
router.post('/studio/promo-codes/check-code', checkCode);
router.post('/studio/promo-codes/create', createNewPromoCode);
router.post('/studio/promo-codes/get-active', getActivePromoCodes);
router.post('/studio/promo-codes/deactivate', deactivatePromoCode);

// router.post('./stripe-add-next-card', stripeSetUpIntentMoreCards);

module.exports = router;
