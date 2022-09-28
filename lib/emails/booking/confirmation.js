const MailClient = require('@dibs-tech/mail-client');
const moment = require('moment-timezone');
const currencyFormatter = require('currency-formatter');
const generateICSForEventWithTime = require('../helpers/ics-generator');
const Decimal = require('decimal.js');
const { handleError } = require('../../errors');
const Promise = require('bluebird');
const models = require('../../../models/sequelize');

const { EmailTypes } = MailClient;
const mc = new MailClient();

/**
 * @param {Object} user instance making purchase
 * @param {Array<Object>} transactions the receipt email is for
 * @param {function} emailType determines which template MailClient uses
 * @returns {Promise<undefined>} if the user is successfully sent an email, error otherwise
 */
module.exports = async function sendBookingConfirmationEmail(user, transactions, emailType = EmailTypes.BOOKING_CONFIRMATION) {
    try {
        const charge = +transactions.reduce((acc, t) => acc.plus(t.chargeAmount), Decimal(0));
        const studio = await models.dibs_studio.findOne({
            where: { id: transactions[0].dibs_studio_id },
            include: [
                {
                    model: models.whitelabel_custom_email_text,
                    as: 'custom_email_text',
                    key: 'dibs_studio_id'
                }
            ]
        });
        const emailData = mc.getEmailDataForStudio(studio, emailType);

        const eventids = transactions.map((t) => t.eventid);
        const events = await models.event.findAll({
            where: { eventid: eventids },
            include: [
                {
                    model: models.dibs_studio,
                    as: 'studio',
                    attributes: ['name', 'country', 'currency']
                },
                {
                    model: models.dibs_studio_locations,
                    as: 'location',
                    attributes: ['address', 'name']
                },
                {
                    model: models.dibs_studio_instructors,
                    as: 'instructor',
                    attributes: ['firstname', 'lastname']
                }
            ]
        });
        events.forEach((event) => {
            event.start_time = moment.tz(moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
            event.end_time = moment.tz(moment(event.end_date).utc().format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
            transactions.forEach((transaction) => {
                if (event.eventid === transaction.eventid) {
                    transaction.event = event;
                    if (!transaction.event.instructor.first_name) {
                        transaction.event.instructor = { first_name: event.instructor.firstname, last_name: event.instructor.lastname };
                    }
                }
            });
        });

        const passids = transactions.map((t) => t.with_passid);
        const passes = await models.passes.findAll({
            where: { id: passids },
            include: [
                {
                    model: models.studio_packages,
                    as: 'studioPackage',
                    attributes: ['unlimited']
                }
            ]
        });
        passes.forEach((pass) => {
            transactions.forEach((transaction) => {
                if (pass.id === transaction.with_passid) transaction.pass = pass;
            });
        });

        const promoids = transactions.map((t) => t.promoid);
        const promoCodes = await models.promo_code.findAll({
            where: { id: promoids }
        });
        promoCodes.forEach((promoCode) => {
            transactions.forEach((transaction) => {
                if (promoCode.id === transaction.promoid) transaction.promoCode = promoCode;
            });
        });

        const flashCredIds = transactions.map((t) => t.flash_credit_id);
        const flashCredits = await models.flash_credit.findAll({
            where: { id: flashCredIds },
            paranoid: false
        });
        flashCredits.forEach((flashCredit) => {
            transactions.forEach((transaction) => {
                if (flashCredit.id === transaction.flash_credit_id) transaction.flashCredit = flashCredit;
            });
        });

        const emailEvents = [];
        transactions.forEach((t) => {
            const emailEvent = {};
            emailEvent.class = {};
            emailEvent.class.name = t.event.name;
            emailEvent.class.location = t.event.location.name;
            emailEvent.class.instructor = `${t.event.instructor.first_name} ${t.event.instructor.last_name}`;
            emailEvent.class.date =
                t.event.studio.country === 'US'
                    ? moment(t.event.start_date).format('M/D/YYYY')
                    : moment(t.event.start_date).format('D/M/YYYY');
            emailEvent.class.day = moment(t.event.start_date).format('dddd').toString();
            emailEvent.class.time =
                t.event.studio.country === 'US' ? moment(t.event.start_time).format('h:mm A') : moment(t.event.start_time).format('H:mm');
            emailEvent.class.classPrice = currencyFormatter.format(t.amount, {
                code: t.event.studio.currency,
                precision: 2
            });
            emailEvent.class.original_price = currencyFormatter.format(t.original_price, {
                code: t.event.studio.currency,
                precision: 2
            });
            if (t.pass) {
                emailEvent.passes = t.pass;
                emailEvent.passes.usesRemaining = t.pass.totalUses - t.pass.usesCount;
                emailEvent.passes.passApplied = true;
                emailEvent.passes.unlimited = t.pass.studioPackage.unlimited;
            }
            if (t.promoCode) {
                const flashCreditAmount = (t.flashCredit && t.flashCredit.credit) || 0;
                emailEvent.promos = {
                    promoAmount: currencyFormatter.format(t.discount_amount - flashCreditAmount, {
                        code: t.event.studio.currency,
                        precision: 2
                    }),
                    promoCode: t.promoCode.code,
                    promoApplied: true
                };
            }
            if (t.studio_credits_spent || t.raf_credits_spent) {
                emailEvent.credits = {
                    creditAmount: currencyFormatter.format(t.studio_credits_spent + t.raf_credits_spent, {
                        code: t.event.studio.currency,
                        precision: 2
                    }),
                    creditApplied: true
                };
            }
            if (t.flashCredit) {
                emailEvent.flashCredits = {
                    flashCreditAmount: currencyFormatter.format(t.flashCredit.credit, {
                        code: t.event.studio.currency,
                        precision: 2
                    }),
                    flashCreditApplied: true
                };
            }
            if (t.tax_amount) {
                emailEvent.taxes = {
                    taxesApplied: true,
                    taxAmount: currencyFormatter.format(t.tax_amount, {
                        code: t.event.studio.currency,
                        precision: 2
                    })
                };
            }
            emailEvents.push(emailEvent);
        });

        emailData.finalPrice = currencyFormatter.format(charge, {
            code: events[0].studio.currency,
            precision: 2
        });
        emailData.individualEvents = emailEvents;
        emailData.user = user;
        emailData.userCredits = null; // TODO what is user credits?

        const attachments = events.map((event) => ({
            type: 'text/calendar',
            name: event.name,
            data: new Buffer(generateICSForEventWithTime(event)).toString('base64')
        }));

        // confirmation that is not being used
        const subjects = {
            [EmailTypes.BOOKING_CONFIRMATION]: `${emailData.studioName} Booking Confirmed`,
            [EmailTypes.WAITLIST_CONFIRMATION]: `You're off the waitlist at ${emailData.studioName}`
        };

        // testing removing attachment for now
        await Promise.promisify(mc.sendTemplatedEmail).call(mc, user.email, subjects[emailType], emailData.template, emailData, {
            force: true,
            // attachments,
            pool: 'transactional',
            from: {
                name: emailData.studioName,
                email: emailData.domain
            }
        });
    } catch (err) {
        handleError({
            opsSubject: 'Booking Confirmation Email Error',
            userid: user.id,
            opsBody: `Failed to send a booking confirmation email to ${user.id} after they made a class purchase`
        })(err);
    }
};
