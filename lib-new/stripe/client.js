const mt = require('moment-timezone');
const Decimal = require('decimal.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

async function formatPayoutWithBankDetails(accountid, paymentObject) {
    try {
        // const testbank = 'ba_1LCs7sL2vZMjltIvNrIUplFs';
        // console.log(`accountid is: ${accountid}`);
        const moneyString = Decimal(paymentObject.amount).dividedBy(100).toNumber();
        const payoutFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(moneyString);
        const status = paymentObject.status;
        let statustoreturn = 'Paid';
        if (status === 'in_transit') {
            statustoreturn = 'In Transit';
        }
        // const bankAccount = await stripe.accounts.retrieveExternalAccount(accountid, testbank);
        const bankAccount = await stripe.accounts.retrieveExternalAccount(accountid, paymentObject.destination);
        const formattedData = {
            datePayout: mt(paymentObject.arrival_date).format('M/D/YY'),
            properPayoutAmount: payoutFormatted,
            formattedBankData: `${bankAccount.bank_name} ****${bankAccount.last4}`,
            payoutId: paymentObject.id,
            stat: statustoreturn
        };
        return formattedData;
    } catch (err) {
        console.log(`error in formatPayoutWithBankDetails api call: ${err}`);
        return err;
    }
}

async function retrieveNewAllBankAccounts(stripeAccountId) {
    try {
        const accountDetails = await stripe.accounts.retrieve(stripeAccountId).then((account) => {
            console.log(`account details are: ${JSON.stringify(account)}`);
        });
        return accountDetails;
    } catch (err) {
        console.log(`error in retrieveAllBankAccounts api call: ${err}`);
        return err;
    }
}
module.exports = { formatPayoutWithBankDetails, retrieveNewAllBankAccounts };
