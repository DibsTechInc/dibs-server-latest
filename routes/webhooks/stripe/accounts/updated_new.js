const MailClient = require('@dibs-tech/mail-client');

const mc = new MailClient();

module.exports = function accountUpdated(req, res) {
    mc.ops('Stripe Webhook New Version', `Data: ${JSON.stringify(req.body)}`);
    console.log(req.body);
    res.status(200).end();
};
