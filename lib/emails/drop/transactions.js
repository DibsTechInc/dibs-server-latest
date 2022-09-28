const MailClient = require('@dibs-tech/mail-client');
const moment = require('moment-timezone');
const { handleError } = require('../../errors');
const Promise = require('bluebird');

const mc = new MailClient();

/**
 * @param {Object} user who booked
 * @param {event} event they dropped
 * @param {string} dropSource where they made the drop
 * @param {string} employeeid who dropped them
 * @returns {Promise<undefind>} sends email to transactions@ondibs.com
 */
module.exports = async function sendDropTransactionsEmail({
  user,
  transactions,
  dropSource,
  employeeid,
  early,
  returnCredit,
  classCanceled,
}) {
  try {
    const event = transactions[0].event.dataValues;
    const eventStartTime = moment.tz(moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'), transactions[0].dibs_studio.mainTZ);
    const studioIds = [transactions[0].dibs_studio.id];
    const earlyText = early ? 'early' : 'late';
    const returnCreditText = returnCredit ? 'received credit' : 'did not receive credit';
    let body = `User ${user.id} - ${user.email} has been dropped at studios ${studioIds.join(', ')}\n\n`;
    body += `Drop was marked as ${earlyText} and user ${returnCreditText}\n\n`;
    if (classCanceled) body += `Drop was triggered by event sync because class was canceled.\n\n`;
    if (employeeid) body += `Employee ${employeeid} dropped the event on the user's behalf\n\n`;
    body += `Event: ${event.name} @ ${moment(eventStartTime).format('M/D/YYYY')} ${moment(eventStartTime).format('h:mm A')} at location: ${event.location.name} with instructor: ${event.instructor}`;
    await Promise.promisify(mc.transactions).call(mc, `Dibs Drop - ${dropSource}`, body);
  } catch (err) {
    handleError({
      opsSubject: 'Transaction Email Error',
      opsBody: `Failed to send an email to transactions@ondibs.com after user ${user.id} made a class purchase`,
      event: transactions[0].event,
    })(err);
  }
};
