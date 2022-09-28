const express = require('express');
const cors = require('cors');
const stripePayoutCreated = require('./webhooks/stripe/payouts/created');
const stripePayoutUpdated = require('./webhooks/stripe/payouts/updated');
const stripeAccountUpdated = require('./webhooks/stripe/accounts/updated');
const stripeAccountUpdatedNew = require('./webhooks/stripe/accounts/updated_new');
// const receiveTwilioCall = require('./webhooks/twilio/receive-call');
// const receiveWaitlistResponse = require('./webhooks/flowxo/waitlist-response');
const invoicePaymentSucceeded = require('./webhooks/stripe/subscriptions/invoices/payment_succeeded');
const invoicePaymentFailed = require('./webhooks/stripe/subscriptions/invoices/payment_failed');
const invoicePaymentUpcoming = require('./webhooks/stripe/subscriptions/invoices/upcoming');
const invoicePaymentCreated = require('./webhooks/stripe/subscriptions/invoices/created');
const sparkpostUnsubscribe = require('./webhooks/sparkpost/unsubscribe');

const router = express.Router();
router.use(cors());

router.post('/sparkpost/unsubscribe', sparkpostUnsubscribe);

router.post('/stripe/account', stripeAccountUpdated);
router.post('/stripe/accountnew', stripeAccountUpdatedNew);

router.post('/stripe/payouts', stripePayoutCreated);
router.post('/stripe/payouts/update', stripePayoutUpdated);

router.post('/stripe/invoices/payment_succeeded', invoicePaymentSucceeded);
router.post('/stripe/invoices/payment_failed', invoicePaymentFailed);
router.post('/stripe/invoices/upcoming', invoicePaymentUpcoming);
router.post('/stripe/invoices/created', invoicePaymentCreated);

// router.post('/twilio/call', receiveTwilioCall);
// router.post('/flowxo/waitlist_response', receiveWaitlistResponse);

// router.post('/errors/dibsloader', postLoaderError);
// router.post('/errors/dibsvideoloader', postLoaderError);

module.exports = router;
