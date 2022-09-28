const MailClient = require('@dibs-tech/mail-client');
const Decimal = require('decimal.js');
const moment = require('moment');
const currencyFormatter = require('currency-formatter');
const getDateFormatFromCountry = require('../../helpers/get-date-format-from-country');
const getPhoneNumberFromCurrency = require('../../helpers/dibs-phone-from-currency');
const ErrorHelper = require('../../helpers/error-helper');

const mc = new MailClient();


module.exports = async function sendAutopaySuccessEmail(autopaySubscription, transaction, pass) {
  const { studio_credits_spent, raf_credits_spent } = transaction;
  const creditsSpent = new Decimal(studio_credits_spent).plus(raf_credits_spent).toNumber();
  const studio = autopaySubscription.studio_package.studio;
  const user = autopaySubscription.user;
  const customEmailText = (studio.custom_email_text.find(cet => cet.template === 'autopay-success') && studio.custom_email_text.find(cet => cet.template === 'autopay-success').text) || '';

  const emailData = {
    customEmailText,
    user,
    package: autopaySubscription.studio_package,
    pass,
    studio,
    transaction,
    creditsSpent: currencyFormatter.format(creditsSpent, { code: studio.currency }),
    originalPrice: currencyFormatter.format(transaction.original_price, { code: studio.currency }),
    hasCredits: creditsSpent > 0,
    finalAmount: currencyFormatter.format(new Decimal(transaction.amount).minus(creditsSpent), { code: studio.currency }),
    phone: {
      html: getPhoneNumberFromCurrency(studio.currency),
      href: getPhoneNumberFromCurrency(studio.currency, { href: true }),
    },
  };
  emailData.renewDate = moment(pass.expiresAt).format(getDateFormatFromCountry(studio.country)).toString();
  if (transaction.tax_amount) {
    emailData.taxes = {
      taxesApplied: true,
      taxAmount: currencyFormatter.format(transaction.tax_amount, {
        code: studio.currency,
        precision: 2,
      }),
    };
  }
  // Needed for Core Collective template
  emailData.amount = currencyFormatter.format(new Decimal(transaction.amount).minus(creditsSpent).toNumber(), {
    code: studio.currency,
    precision: 2,
  });
  const template = emailData.studio.custom_email_template ? emailData.studio.custom_email_template.autoPayNoExpire.link : 'white-label/autopay-pass-granted';

  let domain = 'no-reply@ondibs.com';
  const hasCustomSendingDomain = studio && Boolean(studio.customSendingDomain);
  if (hasCustomSendingDomain) domain = studio.customSendingDomain;

  mc.sendTemplatedEmail(
    user.email,
    `${studio.name} Passes Renewed`,
    template,
    emailData,
    {
      force: true,
      from: {
        name: studio.name,
        email: domain,
      },
    },
    (err) => {
      if (!err) return;
      ErrorHelper.handleError({
        opsSubject: 'Autopay Success Email Failure',
        opsIncludes: `Failure to send user ${user.id} - ${user.email} a receipt of their autopay package renewal with stripe subscription id ${autopaySubscription}.`,
      })(err);
    }
  );
};
