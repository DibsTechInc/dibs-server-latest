const MailClient = require('@dibs-tech/mail-client');
const Decimal = require('decimal.js');
const currencyFormatter = require('currency-formatter');
const { handleError } = require('../../errors');
const moment = require('moment-timezone');
const Promise = require('bluebird');

const mc = new MailClient();
const sendTemplateAsync = Promise.promisify(mc.sendTemplatedEmail, { context: mc });

/**
 * @param {Object} user who booked
 * @param {event} event they dropped
 * @param {string} dropSource where they made the drop
 * @param {string} employeeid who dropped them
 * @returns {Promise<undefind>} sends email to user who dropped
 */
module.exports = async function sendDropConfirmationEmail({
  user,
  employeeid,
  early,
  creditReturned,
  transactions,
  classCanceled,
}) {
  try {
    const studio = transactions[0].dibs_studio;
    const totalCreditedAmount = transactions.reduce((total, transaction) => total.plus(transaction.amount), Decimal(0));

    const emailType = MailClient.EmailTypes.DROP_CONFIRMATION;
    const emailData = mc.getEmailDataForStudio(studio, emailType);
    emailData.passesReturned = transactions.filter(transaction => transaction.with_passid).length;
    emailData.passesUsed = transactions.filter(transaction => transaction.with_passid).length;
    emailData.creditedAmount = (totalCreditedAmount === 0) ? '' : currencyFormatter.format(totalCreditedAmount, {
      code: studio.currency,
      precision: 2,
    });
    emailData.gaveCreditBack = totalCreditedAmount > 0;
    emailData.formattedZero = currencyFormatter.format(0, {
      code: studio.currency,
      precision: 2,
    });
    emailData.early = early;
    const event = transactions[0].event.dataValues;
    const eventStartTime = moment.tz(moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
    event.price = currencyFormatter.format(transactions[0].amount, {
      code: studio.currency,
      precision: 2,
    });
    event.date = studio.currency === 'USD' ? moment(eventStartTime).format('M/D/YYYY') : moment(eventStartTime).format('D/M/YYYY');
    event.startTime = moment(eventStartTime).format('h:mm A');
    emailData.event = event;
    emailData.studio.cancel_time = emailData.studio.cancel_time || 12;
    emailData.creditReturned = creditReturned;
    emailData.numSpotsDropped = transactions.length > 1 ? transactions.length : 0;

    // For Core Collective templates
    emailData.class = event;
    emailData.class.instructor = event.instructor.firstname.concat(' ').concat(event.instructor.lastname);

    const subject = classCanceled ? `${studio.name} Class Canceled` : `${studio.name} Drop Confirmed`;
    await sendTemplateAsync(
      user.email,
      subject,
      emailData.template,
      emailData,
      {
        force: true,
        pool: 'transactional',
        from: {
          name: emailData.studioName,
          email: emailData.domain,
        },
      }
    );
  } catch (err) {
    handleError({
      opsSubject: 'Drop Confirmation Email Error',
      userid: user.id,
      employeeid,
      opsBody: `Failed to send a booking confirmation email to ${user.id} after they made a class purchase`,
    })(err);
  }
};
