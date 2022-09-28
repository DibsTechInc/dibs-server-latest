const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');
const { handleError } = require('../../errors');
const models = require('../../../models/sequelize');

const mc = new MailClient();
const sendTransactionsEmail = Promise.promisify(mc.transactions, { context: mc });

module.exports = async function sendWaitlistTransactionEmail(dibsTransactionId) {
  try {
    const dibsTransaction = await models.dibs_transaction.findById(dibsTransactionId, {
      include: [
        {
          model: models.dibs_user,
          as: 'user',
          attributes: ['email'],
        },
        {
          model: models.dibs_studio,
          as: 'dibs_studio',
          attributes: ['name'],
        },
      ],
    });
    await sendTransactionsEmail(
      'User Got Off the Waitlist',
      `User ${dibsTransaction.user.email} got off the waitlist at ${dibsTransaction.dibs_studio_id} (${dibsTransaction.dibs_studio.name}) for event ${dibsTransaction.eventid}`
    );
  } catch (err) {
    handleError({
      opsSubject: 'Waitlist Transaction Email Error',
      opsIncludes: `Transaction ${dibsTransactionId}`,
    })(err);
  }
};
