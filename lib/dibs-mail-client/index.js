const SparkPost = require('sparkpost');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const axios = require('axios');
const isURL = require('./helpers/validators/isURL');
// const getPhoneNumberFromCurrency = require('./helpers/getDibsPhoneNumber');
const Enum = require('enum');
const dns = require('dns');
const validator = require('validator');

require('./helpers/handlebars/classOrClasses')(handlebars);
/* eslint-disable no-param-reassign */

/**
 * @callback MailClient~primaryCallback
 */

/**
 * MailClient - Description
 *
 * @class MailClient
 * @param {string} apiKey for SparkPost
 */
function MailClient(apiKey = process.env.SPARKPOST_API_KEY) {
  this.apiKey = apiKey;
  this.client = new SparkPost(apiKey);
  this.sparkPostPrefix = 'https://api.sparkpost.com/api/v1';
}

MailClient.EmailTypes = new Enum([
  'BOOKING_CONFIRMATION',
  'ADDED_TO_WAITLIST',
  'WAITLIST_CONFIRMATION',
  'OFF_WAITLIST_CONFIRMATION',
  'PACKAGE_CONFIRMATION',
  'PACKAGE_CONFIRMATION_AUTOPAY',
  'CHECKOUT_RECEIPT',
  'DROP_CONFIRMATION',
  'CLASS_CANCELED',
  'TRAINER_CHANGED',
  'GIFT_CARD',
  'FLASH_CREDIT_DEFAULT',
  'FLASH_CREDIT_SECRET',
  'FLASH_CREDIT_SECRET_UNLOCKED',
  'REFER_A_FRIEND',
  'REFERRAL_COMPLETED',
]);

MailClient.WhiteLabelTemplateMap = {
  [MailClient.EmailTypes.ADDED_TO_WAITLIST]: 'waitlist-confirm',
  [MailClient.EmailTypes.OFF_WAITLIST_CONFIRMATION]: 'confirmation-from-waitlist',
  [MailClient.EmailTypes.WAITLIST_CONFIRMATION]: 'confirmation',
  [MailClient.EmailTypes.BOOKING_CONFIRMATION]: 'confirmation',
  [MailClient.EmailTypes.PACKAGE_CONFIRMATION]: 'package-purchase-no-autopay',
  [MailClient.EmailTypes.PACKAGE_CONFIRMATION_AUTOPAY]: 'package-purchase-with-autopay',
  [MailClient.EmailTypes.CHECKOUT_RECEIPT]: 'checkout-receipt',
  [MailClient.EmailTypes.DROP_CONFIRMATION]: 'drop-confirmation',
  [MailClient.EmailTypes.CLASS_CANCELED]: 'class-canceled',
  [MailClient.EmailTypes.TRAINER_CHANGED]: 'trainer-changed',
  [MailClient.EmailTypes.GIFT_CARD]: 'giftcard-recipient-confirmation',
  [MailClient.EmailTypes.FLASH_CREDIT_DEFAULT]: 'flash-credit-default',
  [MailClient.EmailTypes.FLASH_CREDIT_SECRET]: 'flash-credit-secret',
  [MailClient.EmailTypes.FLASH_CREDIT_SECRET_UNLOCKED]: 'flash-credit-secret-unlock',
  [MailClient.EmailTypes.REFER_A_FRIEND]: 'friend-referral',
  [MailClient.EmailTypes.REFERRAL_COMPLETED]: 'friend-referral-completed',
};

/**
 *
 * @param {string} emailAddr to validate
 * @returns {Promise<Object>} resolves
 */
MailClient.validateEmail = async function validateEmail(emailAddr) {
  try {
    if (!validator.isEmail(emailAddr)) throw new Error('Invalid email address');
    const addresses = await new Promise((resolve, reject) =>
      dns.resolveMx(emailAddr.split('@')[1], (err, result) => (err ? reject(err) : resolve(result))));
    return { success: addresses.length > 0 };
  } catch (err) {
    return { success: false };
  }
};

/**
 * sendEmail - Description
 * @memberof MailClient
 * @instance
 * @param {string} to recipient email
 * @param {string} subject    the subject
 * @param {string} message    the message
 * @param {object} options    the options
 * @param {MailClient~primaryCallback} cb         the callback
 *
 * @returns {type} Description
 */
MailClient.prototype.sendEmail = function sendEmail(to, subject, message, options, cb) {
  // options = options || {force: false}
  let force;
  const recipients = Array.isArray(to) ? to : [{ address: { email: to } }];

  /* taking into account shorthand forcing,
      or if no force argument is passed,
      or if it comes from the ops call */
  if (typeof options === 'boolean' || (!options && !cb) || options === undefined) {
    force = options || false;
    options = {};
    // short-hand to only use the callback
  } else if (cb === undefined && typeof options === 'function') {
    cb = options;
    options = {};
    force = false;
    // if it is the full argument list
  } else {
    force = options.force;
    delete options.force;
  }

  const transmissionObj = {
    options: {
      transactional: true,
    },
    recipients,
    content: {
      from: options.from || {
        name: 'Dibs',
        email: 'no-reply@ondibs.com',
      },
      subject,
      text: message,
    },
  };

  if (options.html) transmissionObj.content.html = options.html;
  if (options.attachments) transmissionObj.content.attachments = options.attachments;
  if (options.pool) transmissionObj.options.pool = options.pool;

  if (process.env.NODE_ENV === 'production' || force) {
    if (cb) {
      this.client.transmissions.send(transmissionObj).then(cb.bind(null, null))
      .catch(cb);
    } else {
      this.client.transmissions.send(transmissionObj);
    }
  } else if (process.env.NODE_ENV !== 'test') {
    console.log(`Subject: ${subject}
    Body: ${message}
    Options: ${options}`);
    if (cb) cb(null);
  }
};


/**
 * ops - Description
 * @memberof MailClient
 * @instance
 * @param {string} subject Description
 * @param {string} message Description
 * @param {object} options Description
 * @param {MailClient~primaryCallback} cb      the callback
 *
 * @returns {undefined}
 */
MailClient.prototype.ops = function ops(subject, message, options, cb) {
  this.sendEmail('ops@ondibs.com', `[ATTN-DIBS] ${subject}`, message, options, cb);
};


/**
 * info - Description
 * @memberof MailClient
 * @instance
 * @param {string} subject Description
 * @param {string} message Description
 * @param {object} options Description
 * @param {MailClient~primaryCallback} cb      Description
 *
 * @returns {type} Description
 */
MailClient.prototype.info = function info(subject, message, options, cb) {
  this.sendEmail('info@ondibs.com', subject, message, options, cb);
};

/**
 * info - Description
 * @memberof MailClient
 * @instance
 * @param {string} subject Description
 * @param {string} message Description
 * @param {object} options Description
 * @param {MailClient~primaryCallback} cb      Description
 *
 * @returns {type} Description
 */
MailClient.prototype.studios = function studio(subject, message, options, cb) {
  this.sendEmail('studios@ondibs.com', subject, message, options, cb);
};

/**
 * sendTemplatedEmail - Description
 * @memberof MailClient
 * @instance
 * @param {string} recipient    the recip
 * @param {string} subject      the subject
 * @param {string} templateName the template name
 * @param {object} data         the data
 * @param {object} options      the options
 * @param {MailClient~primaryCallback} cb           the callback
 *
 * @returns {undefined}
 */
MailClient.prototype.sendTemplatedEmail = async function sendTemplatedEmail(recipient, subject, templateName, data, options, cb) { // eslint-disable-line max-len
  // check if templateName is a link
  const templateIsCustom = isURL(templateName);
  const source = templateIsCustom ? (await axios.get(templateName)).data : fs.readFileSync(path.join(path.resolve('.'), 'email/templates/', `${templateName}.hbs`), 'utf-8');
  const template = handlebars.compile(source);
  const html = template(data);

  let optionsObj;

  if (typeof options === 'function') {
    cb = options;
    optionsObj = { html };
  } else {
    optionsObj = { force: typeof options === 'boolean' ? options : (options.force || false), html };
    if (typeof options !== 'boolean' && options.attachments) optionsObj.attachments = options.attachments;
    if (typeof options !== 'boolean' && options.from) optionsObj.from = options.from;
  }

  this.sendEmail(recipient, subject, '', optionsObj, cb);
};

MailClient.getDefaultTemplateName = function getDefaultTemplateName(emailType) {
  return `white-label/${this.WhiteLabelTemplateMap[emailType]}`;
};

/**
 *
 * @param {Object} studio object to generate email data for
 * @param {string} emailType of email
 * @returns {Object} data object for email
 */
MailClient.prototype.getEmailDataForStudio = function getEmailDataForStudio(studio, emailType) {
  let template = MailClient.getDefaultTemplateName(emailType);
  let customEmailText = '';

  if (studio.custom_email_template || studio.custom_email_text) {
    switch (emailType) {
      case MailClient.EmailTypes.ADDED_TO_WAITLIST:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.waitlisted.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'waitlist') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.OFF_WAITLIST_CONFIRMATION:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.offWaitlistConfirm.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'confirmation-from-waitlist') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.WAITLIST_CONFIRMATION:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.waitlistConfirm.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'confirmation') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.PACKAGE_CONFIRMATION:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.autoPayExpire.link
        ) || template;
        break;

      case MailClient.EmailTypes.PACKAGE_CONFIRMATION_AUTOPAY:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.autoPayNoExpire.link
        ) || template;
        break;

      case MailClient.EmailTypes.BOOKING_CONFIRMATION:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.confirmation.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'confirmation') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.CHECKOUT_RECEIPT:
        template = (((studio.custom_email_template || {}).receipt || {}).link) || template;
        customEmailText = (
          (studio.custom_email_text || []).find(
            cet => cet.template === 'confirmation') || {}).text || ''; // i wish optional chaining was a thing T_T
        break;

      case MailClient.EmailTypes.DROP_CONFIRMATION:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.classDropped.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'drop') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.CLASS_CANCELED:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.classCanceled.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'class-canceled') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.TRAINER_CHANGED:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.trainerChanged.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'trainer-changed') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.GIFT_CARD:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.giftCard.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(cet => cet.template === 'gift-card') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.FLASH_CREDIT_DEFAULT:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.flashCredit
          && studio.custom_email_template.flashCredit.link
        ) || template;
        break;

      case MailClient.EmailTypes.FLASH_CREDIT_SECRET:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.flashCredit
          && studio.custom_email_template.flashCredit.link
        ) || template;
        break;

      case MailClient.EmailTypes.FLASH_CREDIT_SECRET_UNLOCKED:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.flashCreditSecretUnlock
          && studio.custom_email_template.flashCreditSecretUnlock.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (this.studio.custom_email_text.find(cet => cet.template === 'flashcredit-unlock') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.REFER_A_FRIEND:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.referral
          && studio.custom_email_template.referral.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(
              cet => cet.template === 'friend-referral') || {}).text
        ) || '';
        break;

      case MailClient.EmailTypes.REFERRAL_COMPLETED:
        template = (
          studio.custom_email_template
          && studio.custom_email_template.referralCredits
          && studio.custom_email_template.referralCredits.link
        ) || template;
        customEmailText = (
          studio.custom_email_text
          && (studio.custom_email_text.find(
            cet => cet.template === 'referral-reminder') || {}).text
        ) || '';
        break;

      default:
        template = studio.custom_email_template.confirmation.link;
    }
  }
  console.log(`studio info from mailclient ------>>>>>\n\n${JSON.stringify(studio)}`);

  return {
    studio,
    studioName: studio.name,
    studioEmail: studio.studio_email || 'info@ondibs.com',
    template,
    customEmailText,
    phone: {
      text: '(646)-760-3427',
      href: 'tel:646-760-3427',
    },
    domain: studio.customSendingDomain || 'no-reply@ondibs.com',
    purchasePlaceLink: (studio.live && (!studio.liveWidget)) ?
      'https://www.ondibs.com/widget/studio/${studio.id}'
      : `https://${studio.domain}?dibs_open`,
  };
};

MailClient.prototype.transactions = function transactions(subject, message, options, cb) {
  this.sendEmail('transactions@ondibs.com', subject, message, options, cb);
};

/**
 *
 * @param {string} email user to add to
 * @param {function} cb callback on completion
 * @returns {undefined}
 */
MailClient.prototype.addEmailToTransactionalSuppressionList = function addEmailToTransactionalSupressionList(email, cb) {
  this.client.suppressionList.upsert({
    recipient: email,
    type: 'transactional',
  }, cb);
};

/**
 * @param {string} email user to add to list
 * @param {function} cb callback on completion
 * @returns {undefined}
 */
MailClient.prototype.addEmailToNonTransactionalSuppressionList = function addEmailToTransactionalSupressionList(email, cb) {
  this.client.suppressionList.upsert({
    recipient: email,
    type: 'non_transactional',
  }, cb);
};

/**
 * @param {string} email user to remove from list
 * @param {function} cb to execute on complete
 * @returns {undefined}
 */
MailClient.prototype.removeEmailFromTransactionalSuppressionList = function removeEmailFromTransactionalSupressionList(email, cb) {
  if (typeof cb !== 'function') cb = () => {};
  axios.delete(`${this.sparkPostPrefix}/suppression-list/${email}`, {
    headers: {
      Authorization: this.apiKey,
      Accept: 'application/json',
    },
    data: {
      type: 'transactional',
    },
  }).then(response => cb(null, response.data))
    .catch((err => cb(err.response.data)));
};


/**
 *
 * @param {string} email user to remove from list
 * @param {function} cb callback on completion
 * @returns {undefined}
 */
MailClient.prototype.removeEmailFromNonTransactionalSuppressionList = function removeEmailFromNonTransactionalSupressionList(email, cb) {
  if (typeof cb !== 'function') cb = () => {};
  axios.delete(`${this.sparkPostPrefix}/suppression-list/${email}`, {
    headers: {
      Authorization: this.apiKey,
      Accept: 'application/json',
    },
    data: {
      type: 'non_transactional',
    },
  }).then(response => cb(null, response.data))
    .catch((err => cb(err.response.data)));
};
/**
 *
 * @param {Object} context  instance of Mail Client
 * @param {string} prefix   Add or Remove
 * @param {string} list     Transactional or NonTransactional
 * @return {function} method to call
 */
function supressor(context, prefix, list) {
  const method = `${prefix}${list}SuppressionList`;
  return context[method].bind(context);
}

/**
 * Shorthand helper for accessing supression lists
 * Written as an attempt of being cute with some JS
 * @param {string} type   Add or Remove
 * @param {string} list   Must be 'Transactional' or 'NonTransactional'
 * @param {string} email  Email to add or remove
 * @param {function} cb   callback function
 * @returns {undefined}
 */
MailClient.prototype.suppress = function suppress(type, list, email, cb) {
  if (!type.match(/^(add|remove)$/)) throw new Error('Not a valid type of method');
  if (!list.match(/^(Transactional|NonTransactional)$/)) throw new Error('Not a valid type of list');
  const that = this;
  return {
    add() {
      return supressor(that, 'addEmailTo', list)(email, cb);
    },
    remove() {
      return supressor(that, 'removeEmailFrom', list)(email, cb);
    },
  }[type]();
};

module.exports = MailClient;
