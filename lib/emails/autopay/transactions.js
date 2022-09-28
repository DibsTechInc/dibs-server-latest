const MailClient = require('@dibs-tech/mail-client');
const { handleError } = require('../../errors');
const Promise = require('bluebird');

const mc = new MailClient();

/**
 * @param {Object} user with autopay
 * @param {Object} subscription autopay subscription
 * @param {Object} type of autopay transaction - can be Created, Payment succeeded, Payment failed, or Upcoming
 * @returns {Promise<undefind>} sends email to transactions@ondibs.com
 */
module.exports = async function sendAutopayTransactionsEmail(user, subscription, type) {
  try {
    const body = `User ${user.id} - ${user.email} autopayment ${type} for subscription ${subscription.id} at ${subscription.studio_package.studio.name} with id ${subscription.studio_package.studio.id}`;
    await Promise.promisify(mc.transactions).call(mc, `Dibs Autopayment ${type}`, body);
  } catch (err) {
    handleError({
      opsSubject: 'Transaction Email Error',
      opsBody: `Failed to send an email to transactions@ondibs.com after autopay ${type} ${user.id}`,
    })(err);
  }
};
