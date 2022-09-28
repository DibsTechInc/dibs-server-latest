const processPayoutTransactions = require('./process-payout-transactions');
const { handleError } = require('../../../../lib/helpers/error-helper');

module.exports = async function payoutCreatedWebook(req, res) {
  let payout;
  let account;
  try {
    const event = req.body;
    account = event.account;
    payout = event.data.object;
    await processPayoutTransactions(payout, account);
    res.status(200).end();
  } catch (err) {
    handleError({
      opsSubject: 'Payout failed to process',
      res,
      resMessage: `Failed to process payout for payout ${JSON.stringify(payout)} for connected account ${account}`,
    })(err);
  }
};
