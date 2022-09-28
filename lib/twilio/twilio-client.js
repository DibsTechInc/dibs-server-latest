const twilio = require('twilio');
const {
  DIBS_US_NUMBER,
  DIBS_UK_NUMBER,
  DIBS_GREETING_URL,
  DIBS_SMS_LIST,
  DIBS_PHONE_LIST,
} = require('./constants');
const parseSQL = require('../helpers/sql-query-reader');
const filterHelper = require('../helpers/user-admin-filter-helper');
const moment = require('moment');
const { format: formatCurrency } = require('currency-formatter');

/**
 * @class TwilioClient
 * @prop {Object} twilio the twilio Node library
 */
class TwilioClient {
  /**
   * constructor
   * @constructs TwilioClient
   */
  constructor() {
    if (process.env.NODE_ENV === 'test') return;
    this.twilio = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  /**
   * notifyDibsSMS send a SMS notification to Dibs staff
   * @param {string} body the body of the notification
   * @returns {Promise<undefined>} sends the sms using the Twilio Node lib
   */
  notifyDibsStaff(body) {
    return Promise.map(DIBS_SMS_LIST, to => (
      this.twilio.messages.create({ from: DIBS_US_NUMBER, to, body })
    ));
  }

  /**
   * notifyDibsWithUserInfo
   * @param {Object} user instance of the dibs_user model
   * @param {string} type of interaction, either 'sms' or 'call'
   * @param {string} userHandle the phone number of the user
   * @param {string} incomingSMSBody the body of the SMS (if SMS)
   * @returns {Promise<undefined>} queries for the user info then sends an SMS to Dibs staff
   */
  async notifyDibsWithUserInfo(user, type, userHandle, incomingSMSBody) {
    const STUDIOS_BOOKED_AT_QUERY = parseSQL(`${__dirname}/sql/select-user-rank-by-studio.sql`);
    const USER_EVENTS_QUERY = parseSQL(`${__dirname}/sql/select-user-events.sql`);
    const FLASH_CREDITS_QUERY = parseSQL(`${__dirname}/sql/select-user-flash-credits.sql`);

    let body = `A user has ${type === 'sms' ? 'sent an SMS to' : 'called'} Dibs.\n\n`;
    body += `Name: ${user.firstName}\n`;
    body += `User ID: ${user.id}\n`;
    body += `Email: ${user.email}\n`;
    body += `Phone: ${userHandle}\n\n`;
    if (type === 'sms') body += `They sent:\n${incomingSMSBody}\n\n`;

    const [studiosBookedAt, events, flashCredits] = await Promise.all([
      sequelize.query(STUDIOS_BOOKED_AT_QUERY, { type: 'SELECT', bind: { id: user.id } }),
      sequelize.query(USER_EVENTS_QUERY, { type: 'SELECT', bind: { id: user.id } }),
      sequelize.query(FLASH_CREDITS_QUERY, { type: 'SELECT', bind: { id: user.id } }),
    ]);
    const upcomingEvents = filterHelper.run(events).upcoming;

    if (studiosBookedAt.length) {
      body += 'Studios booked at:\n';
      studiosBookedAt.forEach(({ studioName, percentile }) => {
        body += `- ${studioName}: ${percentile}%\n`;
      });
    } else {
      body += 'User has not booked at any studios.\n';
    }
    body += '\n';

    if (!upcomingEvents.length) {
      body += 'Not enrolled in any classes.\n';
    } else {
      body += 'Currently enrolled in:\n';
      upcomingEvents.forEach((event) => {
        body += `- ${moment(event.start_time).format('M/D/Y')} `;
        body += `${event.name} `;
        body += `@ ${event.studioShortName} `;
        body += `(${formatCurrency(event.price, { code: event.currency })}) `;
        body += `${event.id}\n`;
      });
    }

    if (flashCredits.length) {
      body += '\n';
      body += 'Active flash credits:\n';
      flashCredits.forEach((fc) => {
        body += `- ${formatCurrency(fc.credit, { code: fc.currency, precision: 0 })} `;
        body += `at ${fc.studioShortName} `;
        body += `(expires ${moment(fc.expiration).format('M/D/Y')})\n`;
      });
    }

    return this.notifyDibsStaff(body);
  }

  /**
   * sendNotificationWithoutUserInfo
   * @param {string} type of interaction, either 'sms' or 'call'
   * @param {string} userHandle the phone number of the user
   * @param {string} incomingSMSBody the body of the SMS (if SMS)
   * @returns {Promise<undefined>} sends an SMS to Alicia, Emily, Hannah, and me
   */
  notifyDibsWithoutUserInfo(type, userHandle, incomingSMSBody) {
    let body = `A user has ${type === 'sms' ? 'sent an SMS to' : 'called'} Dibs! `;
    body += 'We do not have their phone number on record.\n\n';
    body += `Phone number: ${userHandle}`;
    if (type === 'sms') body += `\n\nThey sent:\n${incomingSMSBody}`;
    return this.notifyDibsStaff(body);
  }

  /**
   * notifyOnIncomingInteraction
   * @param {string} type either 'sms' or 'call'
   * @param {string} userHandle the phone number of the user with country code
   * @param {string} [incomingSmsBody=''] the body of the SMS (if SMS)
   * @returns {Promise<undefined>} sends correct notification format
   */
  async notifyDibsOfIncomingInteraction(type, userHandle, incomingSmsBody = '') {
    if (process.env.NODE_ENV === 'production'
        && type === 'sms'
        && DIBS_SMS_LIST.includes(userHandle)) return Promise.resolve();
    const mobilephone = userHandle.slice(1);
    const shortenedMobilePhone = mobilephone[0] === '4' ? mobilephone.slice(2) : mobilephone.slice(1);
    const user = await models.dibs_user.findOne({
      where: { mobilephone: [mobilephone, shortenedMobilePhone] },
    });
    if (!user) return this.notifyDibsWithoutUserInfo(type, userHandle, incomingSmsBody);
    return this.notifyDibsWithUserInfo(user, type, userHandle, incomingSmsBody);
  }

  /**
   * handleReceivedCall
   * @returns {Promise<string>} resolves XML response for Twilio
   */
  handleReceivedCall() {
    return new Promise((resolve) => {
      const response = new twilio.twiml.VoiceResponse();
      const gather = response.gather({ finishOnKey: 1 });
      const dial = response.dial({ callerId: DIBS_US_NUMBER });
      gather.play(DIBS_GREETING_URL);
      DIBS_PHONE_LIST.forEach(num => dial.number(num));
      resolve(response.toString());
    });
  }

  /**
   * @param {Object} args named arguments
   * @param {string} args.body the body of the text
   * @param {string} args.country of the studio
   * @param {Object} args.user user instance
   * @returns {Promise<undefined>} sends the user an sms
   */
  async sendSmsToUser({ body, country, user }) {
    if (!user.mobilephone) throw new Error(`User ${user.id} does not have a valid mobile phone number`);
    return this.twilio.messages.create({ from: country === 'US' ? DIBS_US_NUMBER : DIBS_UK_NUMBER, to: user.mobilephone, body });
  }
}

module.exports = TwilioClient;
