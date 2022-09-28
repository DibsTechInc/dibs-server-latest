const MailClient = require('@dibs-tech/mail-client');
const { handleError } = require('../../errors');
const currencyFormatter = require('currency-formatter');
const Decimal = require('decimal.js');
const getFormatFromCountry = require('../../../lib/helpers/get-date-format-from-country');
const moment = require('moment-timezone');
const Promise = require('bluebird');

const mc = new MailClient();

/**
 * @param {Object} user instance making purchase
 * @param {Object} purchaseTransaction the receipt email is for
 * @returns {Promise<undefined>} if the user is successfully sent an email, error otherwise
 */
module.exports = async function sendPackagePurchaseConfirmationEmail(user, purchaseTransaction) {
  try {
    const pass = await models.passes.findOne({
      where: { id: purchaseTransaction.for_passid },
    });
    const template = pass.autopay ? MailClient.EmailTypes.PACKAGE_CONFIRMATION_AUTOPAY : MailClient.EmailTypes.PACKAGE_CONFIRMATION;
    const studio = await models.dibs_studio.findOne({
      where: { id: purchaseTransaction.dibs_studio_id },
      include: [{
        model: models.whitelabel_custom_email_text,
        as: 'custom_email_text',
        key: 'dibs_studio_id',
      }],
    });
    const studioPackage = await models.studio_packages.findOne({
      where: { id: purchaseTransaction.studio_package_id },
    });
    const promoCode = await models.promo_code.findOne({
      where: { id: purchaseTransaction.promoid },
    });
    const emailData = mc.getEmailDataForStudio(studio, template);
    emailData.user = user;

    if (promoCode) {
      emailData.promo = {
        promoApplied: true,
        name: promoCode.code,
        promoAmount: currencyFormatter.format(purchaseTransaction.discount_amount, { code: studio.currency }),
      };
    }
    if (purchaseTransaction.tax_amount) {
      emailData.taxes = {
        taxesApplied: true,
        taxAmount: currencyFormatter.format(purchaseTransaction.tax_amount, {
          code: studio.currency,
          precision: 2,
        }),
      };
    }
    let totalCreditsSpent = 0;
    if (purchaseTransaction.studio_credits_spent || purchaseTransaction.raf_credits_spent) {
      totalCreditsSpent = purchaseTransaction.studio_credits_spent + purchaseTransaction.raf_credits_spent;
      emailData.hasCredits = true;
      emailData.creditsSpent = currencyFormatter.format(totalCreditsSpent, {
        code: studio.currency,
        precision: 2,
      });
    }
    emailData.packagePrice = currencyFormatter.format(purchaseTransaction.original_price, {
      code: studio.currency,
      precision: 2,
    });
    emailData.amount = currencyFormatter.format(new Decimal(purchaseTransaction.amount).minus(totalCreditsSpent).toNumber(), {
      code: studio.currency,
      precision: 2,
    });
    emailData.studioPackage = studioPackage;
    emailData.date = moment.tz(studio.mainTZ).format(getFormatFromCountry(studio.country)).toString();
    emailData.pass = pass;
    emailData.clickHereLink = `http://${studio.domain}?dibs_open`;
    emailData.transaction = purchaseTransaction;

    switch (true) {
      case !pass.expiresAt:
        emailData.renewDate = `${studioPackage.passesValidFor} ${studioPackage.validForInterval}${studioPackage.passesValidFor > 1 ? 's' : ''} after first visit`;
        break;
      case studio.currency === 'GBP':
        emailData.renewDate = moment.tz(pass.expiresAt, studio.mainTZ).format('MMMM Do YYYY').toString();
        break;
      default:
        emailData.renewDate = moment(pass.expiresAt).format(getFormatFromCountry(studio.country)).toString();
    }

    await Promise.promisify(mc.sendTemplatedEmail).call(
      mc,
      user.email,
      `${emailData.studioName} Package Purchase`,
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
      opsSubject: 'Package Purchase Confirmation Email Error',
      userid: user.id,
      opsBody: `Failed to send a package purchase confirmation email to ${user.id} after they made a package purchase`,
      opsIncludes: `Transaction ${purchaseTransaction.id}`,
    })(err);
  }
};
