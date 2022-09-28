const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');

const SECRET = 'SECRET';

const mc = new MailClient();
const sendTemplatedEmailAsync = Promise.promisify(mc.sendTemplatedEmail, { context: mc });

/**
 * @param {Object} studio dibs_studio instance
 * @param {boolean} isSecret flash credit is secret
 * @returns {Object} email type and email subject
 */
const getIfSecret = ({ studio, creditAmount, expiration, isSecret }) =>
    isSecret
        ? {
              emailType: MailClient.EmailTypes.FLASH_CREDIT_SECRET,
              subject: `Special flash credit - You unlocked a secret level at ${studio.name}.`
          }
        : {
              emailType: MailClient.EmailTypes.FLASH_CREDIT_DEFAULT,
              subject: `You've got ${creditAmount} flash credits to ${studio.name}⚡. Exp. ${expiration}`
          };

/**
 * @param {number|string} userid of recipient of FC
 * @param {number|string} studioid primary key of studio where FC is for
 * @param {string} templateName if equal to SECRET will send a secret email
 * @param {Object} emailData about the flash credit
 * @returns {Promise<undefined>} sends email, will return rejected promise if error
 */
async function sendFlashCreditReceivedEmail({
    userid,
    studioid,
    templateName,
    emailData: { creditAmount, expiration, bookNowLink, numVisitsThirtyDay }
}) {
    const [user, studio] = await Promise.all([
        models.dibs_user.findById(userid),
        models.dibs_studio.findById(studioid, {
            include: [
                {
                    model: models.whitelabel_custom_email_text,
                    as: 'custom_email_text',
                    key: 'dibs_studio_id'
                },
                {
                    model: models.dibs_config,
                    as: 'dibs_config'
                }
            ]
        })
    ]);
    if (!user || !studio) {
        throw new Error('Cannot send a flash credit without user and studio.');
    }

    const secretPayload = {
        studio,
        creditAmount,
        expiration,
        isSecret: templateName === SECRET
    };

    const { subject, emailType } = getIfSecret(secretPayload);
    let emailData = mc.getEmailDataForStudio(studio, emailType);
    emailData = {
        ...emailData,
        creditAmount,
        expiration,
        bookNowLink,
        numVisitsThirtyDay,
        dateFormat: studio.country === 'US' ? 'mm/dd/yy' : 'dd/mm/yy'
    };

    emailData.userName = user.firstName;
    await sendTemplatedEmailAsync(user.email, subject, emailData.template, emailData, {
        force: true,
        from: {
            name: studio.name,
            email: emailData.domain
        }
    });
}

sendFlashCreditReceivedEmail.SECRET = SECRET;
module.exports = sendFlashCreditReceivedEmail;
