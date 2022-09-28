const MailClient = require('@dibs-tech/mail-client');
const Decimal = require('decimal.js');
const moment = require('moment');
const currencyFormatter = require('currency-formatter');
const getDateFormatFromCountry = require('../../helpers/get-date-format-from-country');
const getPhoneNumberFromCurrency = require('../../helpers/dibs-phone-from-currency');
const ErrorHelper = require('../../helpers/error-helper');

const mc = new MailClient();


module.exports = async function sendAutopayPaymentFailedEmail(autopaySubscription, subscription, invoice) {
  const user = autopaySubscription.user;
  const studioPackage = autopaySubscription.studio_package;
  const studio = studioPackage.studio;
  const customEmailText = (studio.custom_email_text.find(cet => cet.template === 'autopay-fail') && studio.custom_email_text.find(cet => cet.template === 'autopay-fail').text) || '';

  const emailData = {
    customEmailText,
    user,
    studio,
    package: studioPackage,
    subscription,
    amount: currencyFormatter.format(Decimal(invoice.total).dividedBy(100).toNumber(), { code: studio.currency }),
    date: moment().format(getDateFormatFromCountry(studio.country)).toString(),
    phone: {
      html: getPhoneNumberFromCurrency(studio.currency),
      href: getPhoneNumberFromCurrency(studio.currency, { href: true }),
    },
  };

  const template = emailData.studio.custom_email_template ? emailData.studio.custom_email_template.autopayFailed.link : 'white-label/autopay-payment-failed';

  let domain = 'no-reply@ondibs.com';
  const hasCustomSendingDomain = studio && Boolean(emailData.studio.customSendingDomain);
  if (hasCustomSendingDomain) domain = emailData.studio.customSendingDomain;

  mc.sendTemplatedEmail(
    user.email,
    `${emailData.studio.name} Pass Payment Failed`,
    template,
    emailData,
    {
      force: true,
      from: {
        name: emailData.studio.name,
        email: domain,
      },
    },
    (err) => {
      if (!err) return;
      ErrorHelper.handleError({
        opsSubject: 'Autopay Email Failure',
        opsIncludes: `User Autopay Package has Stripe Subscription Id ${subscription}. Stripe Invoice ${invoice.id}`,
      })(err);
    }
  );
};
