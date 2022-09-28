const MailClient = require('@dibs-tech/mail-client');
const moment = require('moment');
const { handleError } = require('../../errors');
const Promise = require('bluebird');

const mc = new MailClient();
const sendTemplatedEmail = Promise.promisify(mc.sendTemplatedEmail, { context: mc });

module.exports = async function sendAddToWaitlistEmail(user, event) {
  try {
    const { template, customEmailText, domain } = mc.getEmailDataForStudio(event.studio, MailClient.EmailTypes.ADDED_TO_WAITLIST);

    await sendTemplatedEmail(
      user.email,
      `${event.studio.name} Waitlist Confirmation`,
      template,
      {
        customEmailText,
        studio: event.studio,
        user,
        class: {
          instructor: `${event.instructor.firstname} ${event.instructor.lastname}`,
          name: event.name,
          time: moment(event.start_date).utc().format('h:mm A'),
          day: moment(event.start_date).utc().format('LL').toString(),
          date: event.studio.currency === 'USD' ? moment(event.start_date).utc().format('M/D/YYYY') : moment(event.start_date).utc().format('D/M/YYYY'),
        },
        studioWidgetUrl: `http://${event.studio.widget_url || event.studio.domain}?dibs_open`,
      },
      {
        force: true,
        from: {
          name: event.studio.name,
          email: domain,
        },
      }
    );
  } catch (err) {
    handleError({
      opsSubject: 'Add To Waitlist Email Confirmation Error',
      opsIncludes: `Event ${event.eventid}`,
      userid: user.id,
    })(err);
  }
};
