const MailClient = require('@dibs-tech/mail-client');
const Decimal = require('decimal.js');
const moment = require('moment');
const currencyFormatter = require('currency-formatter');
const getDateFormatFromCountry = require('../../helpers/get-date-format-from-country');
const getPhoneNumberFromCurrency = require('../../helpers/dibs-phone-from-currency');
const ErrorHelper = require('../../helpers/error-helper');

const mc = new MailClient();


module.exports = async function sendAutopayUpcomingEmail(autopaySubscription, subscription, invoice) {
  const user = autopaySubscription.user;
  const studioPackage = autopaySubscription.studio_package;

  // Core Collective does not want to send this email, we don't have a template for them so this logic
  // should prevent CC users from getting an email without affecting other studios
  if (studioPackage.studio.custom_email_template && !studioPackage.studio.custom_email_template.autopayUpcoming) return;

  const customEmailText = (studioPackage.studio.custom_email_text.find(cet => cet.template === 'autopay-upcoming') && studioPackage.studio.custom_email_text.find(cet => cet.template === 'autopay-upcoming').text) || '';

  const emailData = {
    customEmailText,
    user,
    studio: studioPackage.studio,
    package: studioPackage,
    subscription,
    amount: currencyFormatter.format(Decimal(invoice.amount_due).dividedBy(100).toNumber(), { code: studioPackage.studio.currency }),
    date: moment.unix(invoice.date).format(getDateFormatFromCountry(studioPackage.studio.country)).toString(),
    phone: {
      html: getPhoneNumberFromCurrency(studioPackage.studio.currency),
      href: getPhoneNumberFromCurrency(studioPackage.studio.currency, { href: true }),
    },
  };

  let domain = 'no-reply@ondibs.com';
  const hasCustomSendingDomain = studioPackage.studio && Boolean(studioPackage.studio.customSendingDomain);
  if (hasCustomSendingDomain) domain = studioPackage.studio.customSendingDomain;

  mc.sendTemplatedEmail(
    user.email,
    `${studioPackage.studio.name} Upcoming Pass Payment`,
    'white-label/autopay-upcoming-payment',
    emailData,
    {
      force: true,
      from: {
        name: studioPackage.studio.name,
        email: domain,
      },
    },
    (err) => {
      if (!err) return;
      ErrorHelper.handleError({
        opsSubject: 'Autopay Upcoming Email Failure',
        opsIncludes: `User Autopay Package has Stripe Subscription Id ${subscription}. Stripe Invoice ${invoice.id}`,
      })(err);
    }
  );
};
