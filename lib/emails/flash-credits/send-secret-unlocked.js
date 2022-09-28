const MailClient = require('@dibs-tech/mail-client');
const moment = require('moment');
const { handleError } = require('@dibs-tech/dibs-error-handler');
const Promise = require('bluebird');

const mc = new MailClient();
const sendTemplatedEmailAsync =
  Promise.promisify(mc.sendTemplatedEmail, { context: mc });

module.exports = async function sendSecretUnlockedEmail(user, flashCredit) {
  try {
    if (!flashCredit.is_secret) return;
    if (flashCredit.studio === null) {
      mc.ops(
        'Flash Credit Unlocked (No Studio)',
        `User ${user.id} has unlocked secret flash credits but no studio was passed to email sender.`
      );
      return;
    }

    const emailData = mc.getEmailDataForStudio(
      flashCredit.studio, MailClient.EmailTypes.FLASH_CREDIT_SECRET_UNLOCKED);

    emailData.firstName = user.firstName;
    emailData.userid = user.id;
    emailData.date = moment().add(3, 'days').format('LL');
    await sendTemplatedEmailAsync(
      user.email,
      'You used it - you earned it - here\'s your reward',
      emailData.template,
      emailData,
      {
        force: true,
        pool: 'transactional',
        from: {
          name: flashCredit.studio.name,
          email: emailData.domain,
        },
      }
    );
  } catch (err) {
    handleError({
      opsSubject: 'Secret Flash Credit Email Error',
      opsIncludes: `Flash credit ${flashCredit.id}`,
      userid: user.id,
    })(err);
  }
};
