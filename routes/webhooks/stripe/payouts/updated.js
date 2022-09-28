const { handleError } = require('../../../../lib/helpers/error-helper');
const moment = require('moment');

const StripePayouts = models.stripe_payouts;

module.exports = async function payoutUpdatedWebhook(req, res) {
  let account;
  let payout;
  let type;
  try {
    const event = req.body;
    account = event.account;
    payout = event.data.object;
    const { id } = payout;
    payout.arrival_date = moment.unix(payout.arrival_date);
    type = event.type;
    if (type === 'payout.failed') {
      handleError({
        opsSubject: 'Payout failed to process',
        res,
        resMessage: `Failed to process payout for payout ${JSON.stringify(payout)} for connected account ${account}`,
      })({});
    }
    const [stripePayout] = await StripePayouts.findOrInitialize({
      where: {
        id,
      },
      // defaults: payout,
    });
    const keys = Object.keys(payout);
    keys.forEach(key => stripePayout[key] = payout[key]);
    await stripePayout.save().bind(stripePayout);
    res.status(200).end();
  } catch (err) {
    console.dir(err, { depth: null });
    if (type === 'payout.failed') {
      handleError({
        opsSubject: 'Payout failed to updated, and stripe Payout failed to process',
        res,
        resMessage: `Failed to process payout for payout ${JSON.stringify(payout)} for connected account ${account}`,
      })(err);
    } else {
      handleError({
        opsSubject: 'Payout failed to updated, and stripe Payout failed to process',
        res,
        resMessage: `Failed to process payout for payout ${JSON.stringify(payout)} for connected account ${account}`,
      })(err);
    }
    res.status(200).end();
  }
};
