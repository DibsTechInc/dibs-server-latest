const Decimal = require('decimal.js');
const MailClient = require('@dibs-tech/mail-client');
const moment = require('moment-timezone');
const errorHelper = require('../helpers/error-helper');
const StripeClient = require('../stripe/client');
const { unenrollUserFromEvents } = require('../booking/unenrollment');

const sc = new StripeClient();
const mc = new MailClient();
const sendTemplatedEmailAsync =
  Promise.promisify(mc.sendTemplatedEmail, { context: mc });

/*

Drop code

Expects dibs_portal_userid and eventid

*/

const dropLib = {};

/**
 * @param {Object} user who the purchase is for
 * @param {String} dibsPortalTransactionId transaction to drop
 * @returns {Object} API response
 */
dropLib.dropPortalClass = async function dropPortalClass({
  user,
  dibsPortalTransactionId,
}) {
  let t;
  let studio;
  let userStudio;
  try {
    t = await models.dibs_portal_transaction.findOne({
      where: {
        id: dibsPortalTransactionId,
      },
    });
    const event = await models.event.findOne({
      where: {
        eventid: t.eventid,
      },
      include: [{
        model: models.dibs_studio_locations,
        as: 'location',
        attributes: ['tax_rate'],
      },
      {
        model: models.dibs_studio_instructors,
        as: 'instructor',
        attributes: ['firstname', 'lastname'],
      }],
    });

    studio = await models.dibs_studio.findByPk(+event.dibs_studio_id, {
      include: [{
        model: models.dibs_config,
        as: 'dibs_config',
      }],
    });
    const brand = await models.dibs_brand.findOne({
      where: {
        dibs_studio_id: studio.id,
      },
    });
    userStudio = await models.dibs_user_studio.findOne({
      where: {
        dibs_portal_userid: user.id,
        dibs_studio_id: studio.id,
      },
    });

    const flashCredit = await models.flash_credit.findOne({
      where: {
        id: t.flashCreditId,
      },
    });
    if (flashCredit && flashCredit.expiration > moment()) {
      await flashCredit.restore();
    }

    const transactionWithEvent = t;
    transactionWithEvent.event = event;
    if (studio.source !== 'zf') {
      await unenrollUserFromEvents({
        user,
        studio,
        transactions: [transactionWithEvent],
        early: true,
        clientid: userStudio.clientid,
      });
    } else {
      await models.attendees.update(
        { dropped: true, early_cancel: true },
        {
          where: {
            attendeeID: String(t.id),
            dibs_studio_id: studio.id,
            dropped: false,
          },
        }
      );
    }
    const refund = await sc.refund(t.stripe_charge_id, {
      stripeAccountId: studio.stripe_account_id,
    });
    t.stripe_refund_id = refund.id;

    const eventStartTime = moment.tz(moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
    const date = moment(eventStartTime).format('dddd, MMM D').concat(' at ').concat(moment(eventStartTime).format('h:mm A'));
    const emailData = {
      template: 'dibs-portal/drop-confirmation',
      brand,
      studio,
      amountRefunded: Decimal(refund.amount).dividedBy(100),
      date,
      instructorName: event.instructor.firstname.concat(' ').concat(event.instructor.lastname),
      className: event.name,
      location: event.location.name,
    };

    mc.transactions(`Dibs Portal Drop ${studio.name}`, `Portal user ${user.id}, ${user.email} dropped event ${event.eventid}.`);
    await sendTemplatedEmailAsync(
      user.email,
      `All set! Your class at ${emailData.studio.name} was dropped.`,
      emailData.template,
      emailData,
      {
        force: true,
      }
    );
    t.description += '| Drop complete';
    t.deletedAt = moment();
    await t.save();

    return apiSuccessWrapper({ user });
  } catch (err) {
    return errorHelper.handleError({
      opsSubject: 'Portal Drop Error',
      opsIncludes: err.message,
      userid: user.id,
      returnResponse: true,
      resMessage: 'Oops! Something went wrong, please reach out to us if you are unable to drop',
    })(err);
  }
};

module.exports = dropLib;
