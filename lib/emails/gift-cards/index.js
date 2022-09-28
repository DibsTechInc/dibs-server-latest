const { handleError } = require('@dibs-tech/dibs-error-handler');
const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');
const { format: formatCurrency } = require('currency-formatter');

const mc = new MailClient();

const sendTemplateEmailAsync = Promise.promisify(mc.sendTemplatedEmail, { context: mc });

module.exports = {
  /**
   * @param {Object} user who bought gift card
   * @param {number} employeeid if bought by studo on users behalf
   * @param {string} fromValue who the gift card will be from
   * @param {Object} dibsTransaction instance for gift card
   * @param {string} message for gift card
   * @param {string} recipientEmail email the template is sent to
   * @returns {Promise<undefined>} sends email
   */
  async sendGiftCardEmail({
    user,
    employeeid,
    from: fromValue,
    dibsTransaction,
    message,
    recipientEmail,
  }) {
    try {
      const studio = await models.dibs_studio.findById(dibsTransaction.dibs_studio_id, {
        include: [{ model: models.dibs_config, as: 'dibs_config' }],
      });
      const emailData = mc.getEmailDataForStudio(studio, MailClient.EmailTypes.GIFT_CARD);
      const giftCard = await models.dibs_gift_card.findById(dibsTransaction.gift_card_id, {
        attributes: [],
        include: [{
          model: models.promo_code,
          as: 'promoCode',
        }],
      });
      emailData.giftCardAmount = formatCurrency(dibsTransaction.amount, { code: studio.currency });
      // TODO find a way to escape newlines to break tags in the MailClient
      emailData.giftMessage = message;
      emailData.senderName = fromValue || `${user.firstname} ${user.lastname}`;
      emailData.giftCardCode = giftCard.promoCode.code;
      const subject = `${studio.name} Gift Card`;
      await sendTemplateEmailAsync(
        recipientEmail || user.email,
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
        opsSubject: 'Gift Card Email Error',
        opsIncludes: `Gift card transaction ID: ${dibsTransaction.id}`,
        userid: user.id,
        employeeid,
      })(err);
    }
  },
};
