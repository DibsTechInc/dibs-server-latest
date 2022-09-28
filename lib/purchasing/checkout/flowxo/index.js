const moment = require('moment-timezone');
const axios = require('axios');
const { Op } = require('sequelize');
const handleError = require('../../../helpers/error-helper');


const flowxoLib = {};

/**
 * @param {Object} user who the purchase is for
 * @param {Object} cart which is getting checkout out
 * @param {Object} promoCode used at checkout
 * @param {string} purchasePlace where transaction is made
 * @param {number} employeeid of employee acting on user's behalf
 * @param {boolean} dibsAdmin if the person making the purchase is doing so through admin tools (triggers price validation skip)
 * @param {boolean} sendEmail if false will not send receipt emails
 * @returns {Object} API response
 */
flowxoLib.notifyUserByText = async function notifyUserByText({
  userid,
  eventidToSend,
  mobilephone,
}) {
  try {
    let timeToGive = '1 hour';
    let expireQuestion = 60;
    let lateNight = false;
    let moreOnWaitlist = false;
    let mobilephoneUpdated = mobilephone;
    if (mobilephone.length < 11 && !mobilephone.startsWith('1')) {
      mobilephoneUpdated = 1;
      mobilephoneUpdated += mobilephone;
    }
    if (mobilephone === null) {
      mobilephoneUpdated = '13104037905';
    }
    // determine how long we should give them to respond based on how close we are to the start of the class
    const classInfo = await models.event.findOne({
      where: {
        eventid: eventidToSend,
      },
    });
    const className = classInfo.name;
    const timezone = await models.dibs_studio.findOne({
      where: {
        id: classInfo.dibs_studio_id,
      },
    });
    const studioName = timezone.short_name;
    const nextClientOnWaitlist = await models.dibs_transaction.findOne({
      where: {
        eventid: eventidToSend,
        type: models.dibs_transaction.Types.WAITLIST,
        deletedAt: null,
        void: { [Op.not]: true },
      },
      order: [
        ['id', 'ASC'],
      ],
    });
    if (nextClientOnWaitlist && (Object.keys(nextClientOnWaitlist).length !== 0)) {
      moreOnWaitlist = true;
    }
    const startDateFromDB = classInfo.start_date;
    const d = new Date(startDateFromDB);
    const monthToUse = d.getUTCMonth() + 1;
    const nowInTimeZone = moment.tz(timezone.mainTZ).format('YYYY-MM-DD HH:mm');
    const hourInTimeZone = moment.tz(timezone.mainTZ).format('HH');
    if (hourInTimeZone >= 22) {
      lateNight = true;
    }
    const startTimeString = `${d.getUTCFullYear()}-${monthToUse}-${d.getUTCDate()} ${d.getUTCHours()}:${d.getUTCMinutes()}`;
    const startTimeStringAsMoment = moment(startTimeString, 'YYYY-MM-DD HH:mm');
    // determine display time
    const e = new Date(startDateFromDB);
    const displayTimeString = `${e.getUTCFullYear()}-${monthToUse}-${e.getUTCDate()} ${e.getUTCHours()}:${e.getUTCMinutes()}`;
    const displayTime = moment(displayTimeString).format('h:mm a');
    console.log(`\n\ndisplayTime = ${displayTime}`);
    const startTimeStringLessSixHours = moment(startTimeStringAsMoment).subtract(6, 'hours').format('YYYY-MM-DD HH:mm');
    const startTimeStringLessOneHour = moment(startTimeStringAsMoment).subtract(80, 'minutes').format('YYYY-MM-DD HH:mm');
    if (moment(startTimeStringLessOneHour) < moment(nowInTimeZone)) {
      timeToGive = '15 minutes';
      expireQuestion = 15;
    } else if (moment(startTimeStringLessSixHours) < moment(nowInTimeZone)) {
      timeToGive = '30 minutes';
      expireQuestion = 30;
    }
    const usermobile = mobilephoneUpdated;
    await axios.get(`https://flowxo.com/hooks/a/ygmpp5np?usermobile=${usermobile}&studioName=${studioName}&timeofclass=${displayTime}&timetogive=${timeToGive}&expireQuestion=${expireQuestion}&lateNight=${lateNight}&moreOnWaitlist=${moreOnWaitlist}&className=${className}&eventidToSend=${eventidToSend}&userid=${userid}`);
    // send a text message to the user via flowxo
    // set 'askedAvailability' attribute in flowxo
    return;
  } catch (err) {
    handleError({
      opsSubject: 'Notifying Next Waitlist From Webhook Error',
      opsIncludes: `failed to notify client: ${userid} for class: ${eventidToSend}`,
    })(err);
  }
};

module.exports = flowxoLib;
