const MailClient = require('@dibs-tech/mail-client');
const { handleError } = require('../../errors');
const Promise = require('bluebird');

const mc = new MailClient();

/**
 * @param {Object} user who booked
 * @param {Object} dibsTransaction for pass purchased
 * @param {string} purchasePlace where they made the purchase
 * @param {string} employeeid how made the purchase on user's behalf
 * @returns {Promise<undefined>} sends email to transactions@ondibs.com
 */
module.exports = async function sendPackagePurchaseTransactionsEmail(user, dibsTransaction, purchasePlace, employeeid) {
  const pass = await models.passes.findOne({
    where: { id: dibsTransaction.for_passid },
  });
  const studio = await models.dibs_studio.findOne({
    where: { id: dibsTransaction.dibs_studio_id },
  });
  try {
    let body = `User ${user.id} - ${user.email} has purchased a pass at studios ${studio.id}\n\n`;
    if (employeeid) body += `Employee ${employeeid} made the booking on this user's behalf`;
    body += `Pass: ${pass.id}`;
    await Promise.promisify(mc.transactions).call(mc, `Dibs Package Purchase - ${purchasePlace}`, body);
  } catch (err) {
    handleError({
      opsSubject: 'Transaction Email Error',
      opsBody: `Failed to send an email to transactions@ondibs.com after user ${user.id} made a package purchase`,
      opsIncludes: `Pass is ${pass.id}. Transaction is ${dibsTransaction.id}`,
    })(err);
  }
};
