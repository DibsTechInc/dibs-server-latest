const Decimal = require('decimal.js');
const MailClient = require('@dibs-tech/mail-client');
const moment = require('moment-timezone');
const { Op } = require('sequelize');
const errorHelper = require('../helpers/error-helper');
const StripeClient = require('../stripe/client');
const validateEventPriceHelper = require('./helpers/validate-event-price');
const associateClientToUser = require('../helpers/associate-clientid-to-user');
const {
  enrollUserInEvent,
  checkEventAvailability,
} = require('../booking/enrollment');
const { unenrollUserFromEvents } = require('../booking/unenrollment');

const sc = new StripeClient();
const mc = new MailClient();
const sendTemplatedEmailAsync =
  Promise.promisify(mc.sendTemplatedEmail, { context: mc });

/*

Checkout code

Expects dibs_portal_userid and eventid

*/

const checkoutLib = {};

/**
 * @param {Object} user who the purchase is for
 * @param {String} eventid getting purchased
 * @param {Number} price of the event
 * @returns {Object} API response
 */
checkoutLib.checkoutPortalCart = async function checkoutCart({
  user,
  eventid,
  price,
}) {
  let charge = false;
  let needsUnenroll = false;
  let t;
  let studio;
  let userStudio;
  let amount = price;
  try {
    let emailData;
    // await validateEventPriceHelper(user, eventid, price);

    const event = await models.event.findOne({
      where: {
        eventid,
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
    const flashCredit = await models.flash_credit.findOne({
      where: {
        dibs_brand_id: brand.id,
        dibs_portal_userid: user.id,
      },
      paranoid: true,
    });
    const flashCreditId = flashCredit && flashCredit.id;

    [userStudio] = await models.dibs_user_studio.findOrCreate({
      where: {
        dibs_portal_userid: user.id,
        dibs_studio_id: studio.id,
      },
      defaults: {
        source: studio.source,
        studioid: studio.studioid,
      },
    });

    if (!userStudio.signed_waiver && studio.requiresWaiverSigned) {
      userStudio.signed_waiver = sequelize.fn('now');
    }

    await userStudio.save();
    // this is needed for first name/last name for user signup
    const userWithName = user;
    userWithName.firstName = user.first_name;
    userWithName.lastName = user.last_name;
    if (!userStudio.clientid) {
      userStudio = await associateClientToUser.assign(userWithName, userStudio, studio);
    }

    const eventWithStudio = event;
    eventWithStudio.studio = studio;
    await checkEventAvailability(user, userStudio.clientid, null, { event: eventWithStudio, quantity: 1 });

    t = models.dibs_portal_transaction.build({
      dibs_portal_userid: user.id,
      dibs_brand_id: brand.id,
      description: 'Begin transaction',
      eventid,
      flash_credit_id: flashCreditId,
    });
    await t.save();

    await models.sequelize.transaction(async (sqlTransaction) => {
      let flashCreditAmount = 0;
      if (flashCredit && flashCredit.expiration >= moment()) {
        flashCreditAmount = flashCredit.credit;
        await flashCredit.destroy({ transaction: sqlTransaction });
      }

      const taxRate = +Decimal(event.location.tax_rate).dividedBy(100);
      const taxAmount = +Decimal(price).minus(flashCreditAmount).times(taxRate).toDP(2);
      amount -= flashCreditAmount;
      amount += taxAmount;
      const taxWithheldCoeff = Decimal(1).minus(
        Decimal(1).dividedBy(Decimal(1).plus(taxRate))
      );
      const taxWithheld = +Decimal(amount).times(taxWithheldCoeff).toDP(2);
      const dibsFee = +Decimal(amount).minus(taxWithheld).times(studio.admin_fee_rate).toDP(2);
      const applicationFee = +Decimal(dibsFee).plus(taxWithheld);

      t.amount = amount;
      t.tax_amount = taxAmount;
      t.dibs_fee = dibsFee;

      const managedAccountCustomerId = await sc.findOrCreateManagedAccountCustomerPortal({
        user,
        studio,
        userStudio,
      });
      charge = await sc.preChargeCard({
        customerId: managedAccountCustomerId,
        amount,
        currency: 'USD',
        description: `${studio.name} - Purchase - Dibs`,
        account: studio.stripe_account_id,
        statementDescriptor: studio.name,
        applicationFee,
      });
      t.description += '| Precharge complete';
      t.stripe_charge_id = charge.id;

      needsUnenroll = true;
      if (studio.source !== 'zf') {
        await enrollUserInEvent(user, event, userStudio);
      } else {
        const [dibsUser] = await models.dibs_user.findOrCreate({
          where: {
            email: {
              [Op.iLike]: user.email,
            },
          },
          defaults: {
            firstName: user.first_name,
            lastName: user.last_name,
          },
        });
        await models.attendees.findOrCreate({
          where: {
            attendeeID: String(t.id),
            dibs_studio_id: studio.id,
          },
          defaults: {
            source: 'zf',
            studioID: studio.studioid,
            clientID: '',
            dropped: false,
            classID: event.classid,
            visitDate: event.start_date,
            email: user.email,
            firstname: dibsUser.firstName,
            lastname: dibsUser.lastName,
            userid: dibsUser.id,
            eventid: event.eventid,
            spot_id: null,
          },
        });
      }
      t.description += '| Enrollment complete';

      if (charge) {
        const completeCharge = await sc.completeCharge({
          chargeId: charge.id,
          amount,
          account: studio.stripe_account_id,
        });
        const stripeFeeDetails = completeCharge.balance_transaction.fee_details.find(fd => fd.type === 'stripe_fee');
        const actualStripeFee = Decimal(stripeFeeDetails.amount).dividedBy(100);
        t.stripe_fee = actualStripeFee;
      }
      t.description += '| Capture charge complete';
      t.brand_payment = +Decimal(amount).minus(taxAmount)
                                        .minus(dibsFee)
                                        .minus(t.stripe_fee)
                                        .toDP(2);

      const eventStartTime = moment.tz(moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
      const date = moment(eventStartTime).format('dddd, MMM D').concat(' at ').concat(moment(eventStartTime).format('h:mm A'));
      emailData = {
        template: 'dibs-portal/checkout-confirmation',
        brand,
        studio,
        taxAmount,
        flashCreditAmount,
        price,
        total: amount,
        date,
        instructorName: event.instructor.firstname.concat(' ').concat(event.instructor.lastname),
        className: event.name,
        location: event.location.name,
      };
    });

    await models.event.addSpotsBooked(eventid, 1);

    mc.transactions(`Dibs Portal Purchase ${studio.name}`, `Portal user ${user.id}, ${user.email} booked event ${eventid} for ${price}. Flash credit ${flashCreditId} was used.`);
    await sendTemplatedEmailAsync(
      user.email,
      `Your Class at ${emailData.studio.name} is Booked!`,
      emailData.template,
      emailData,
      {
        force: true,
      }
    );
    t.description += '| Sent email complete';
    await t.save();

    return apiSuccessWrapper({ user });
  } catch (err) {
    if (charge) {
      const refund = await sc.refund(t.stripe_charge_id, {
        amount,
        stripeAccountId: studio.stripe_account_id,
      });
      t.stripe_refund_id = refund.id;
    }
    if (needsUnenroll) {
      const transactionWithEvent = t;
      transactionWithEvent.event = event;
      await unenrollUserFromEvents({
        user,
        studio,
        transactions: [transactionWithEvent],
        early: true,
        clientid: userStudio.clientid,
      });
    }
    if (t) {
      t.void = true;
      await t.save();
    }
    return errorHelper.handleError({
      opsSubject: 'Portal Checkout Error',
      opsIncludes: err.message,
      userid: user.id,
      returnResponse: true,
      resMessage: 'Oops! Something went wrong, please reach out to us if you are unable to book',
    })(err);
  }
};

module.exports = checkoutLib;
