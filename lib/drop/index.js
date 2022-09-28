const Promise = require('bluebird');
const moment = require('moment-timezone');
const bookingErrorLib = require('../errors/booking');
const dropErrorLib = require('../errors/drop');
const emailLib = require('../emails/drop');
const MailClient = require('@dibs-tech/mail-client');
const dropQueryLib = require('./query');
const stripeLib = require('../purchasing/shared/stripe');
const unenrollmentLib = require('../booking/unenrollment');
const markAttendeeAsDropped = require('../booking/unenrollment/shared/mark-attendee-as-dropped');
const dropHelpersLib = require('./helpers');

const mc = new MailClient();

/**
 * @param {Object} transaction transaction to return credit from
 * @param {Object} refundCharges whether or not to refund
 * @returns {Object} success
 */
async function returnCredit({ user, transaction, refundCharges, sqlTransaction }) {
    try {
        // Reset pass expiration if it was set by event
        if (transaction.pass && transaction.id === transaction.pass.expiration_set_by_transaction) {
            await transaction.pass.resetExpirationSetByEvent({ save: true, transaction: sqlTransaction });
        }
        // Give pass use back if not unpaid
        if (transaction.pass && !transaction.unpaid) {
            if (moment(transaction.pass.expiresAt).toDate() < moment().toDate()) {
                await user.addCreditForStudio(+transaction.pass.passValue, transaction.dibs_studio, {
                    save: true,
                    associatedTransactionId: transaction.id,
                    transaction: sqlTransaction,
                    creditTransactionType: models.credit_transaction.Types.CLASS_DROP
                });
                transaction.description += '| Finished credit';
            } else {
                await transaction.pass.reload();
                await transaction.pass.returnUses(1, { save: true, transaction: sqlTransaction });
                transaction.description += '| Finished returning pass use';
            }
        }
        // Refund charges if refund flag is passed through
        if (refundCharges) {
            await stripeLib.refund(transaction.stripe_charge_id, Boolean(transaction.dibs_studio.stripe_account_id), {
                transaction,
                sqlTransaction
            });
            transaction.description += '| Finished refunding user';
        }
        // If no pass, and no refund, return amount to user in studio credit
        if (!transaction.pass && !refundCharges) {
            const creditToAddBack = transaction.amount;
            await user.addCreditForStudio(+creditToAddBack, transaction.dibs_studio, {
                save: true,
                associatedTransactionId: transaction.id,
                transaction: sqlTransaction,
                creditTransactionType: models.credit_transaction.Types.CLASS_DROP
            });
            transaction.description += '| Finished adding credit';
        }
        // Restore user's flash credit
        if (transaction.flashCredit) {
            await transaction.flashCredit.restore();
        }
        // Restore ability to use promo code if refundable
        if (transaction.promo_code && transaction.promo_code.promoCodesUser && transaction.promo_code.refundable) {
            await transaction.promo_code.promoCodesUser.destroy();
        }
    } catch (err) {
        throw new dropErrorLib.ReturnCreditError(err);
    }
}

/**
 * @param {Object}        args passed to function
 * @param {Object}        args.user dropping
 * @param {Object}        args.event being dropped
 * @param {PurchaseError} args.err that was thrown in code
 * @param {number}        args.dibsStudioId the studio we were checking events out for
 *                                          when the error is thrown
 * @param {Object}        args.studio the studio where the classes being purchased are
 * @returns {Object} failure response json
 */
function handleDropUserError({ user, event, studio, err, returnResponse, employeeid }) {
    switch (err.constructor) {
        case bookingErrorLib.UnenrollmentError:
            return bookingErrorLib.handleBookingError({ err, user, eventid: event.eventid, studio, returnResponse, employeeid });
        default:
            return dropErrorLib.handleDropError({ user, event, studio, err, returnResponse, employeeid });
    }
}

const dropLib = {
    returnCredit,
    handleDropUserError,
    EarlyDropOverrideValues: dropHelpersLib.enums.EarlyDropOverrideValues,
    ReturnCreditOverrideValues: dropHelpersLib.enums.ReturnCreditOverrideValues
};

/**
 * @param {Object} args passed to function
 * @param {Object} args.user user to drop
 * @param {number} args.eventid id of event to drop
 * @param {number} args.numSeats numSeats to drop, default is 1
 * @param {enum} args.earlyLateDropOverride override to mark as early or late
 * @param {enum} args.returnCreditOverride override to return credit
 * @param {boolean} args.refundCharges if true, refund stripe charges
 * @param {boolean} args.sendEmail if true, send user an email confirming drop
 * @param {string} args.dropSource where the drop is happening
 * @param {number} args.employeeid of employee acting on user's behalf
 * @returns {Object} API response
 */
async function dropUserFromEvent({
    user,
    eventid,
    transactionid,
    earlyLateDropOverride = dropHelpersLib.enums.EarlyDropOverrideValues.NONE, // 'NONE', 'EARLY', 'LATE'
    returnCreditOverride = dropHelpersLib.enums.ReturnCreditOverrideValues.NONE, // 'NONE', 'FORFEIT', 'RETURN'
    refundCharges = false,
    sendEmail = true,
    dropSource = null,
    employeeid = null,
    classCanceled = false,
    droppedDuringGracePeriod = false
}) {
    let transactions = [];
    let event = null;
    let studio = null;
    try {
        if (classCanceled) {
            earlyLateDropOverride = dropHelpersLib.enums.EarlyDropOverrideValues.EARLY;
            returnCreditOverride = dropHelpersLib.enums.ReturnCreditOverrideValues.RETURN;
        }
        if (droppedDuringGracePeriod) {
            earlyLateDropOverride = dropHelpersLib.enums.EarlyDropOverrideValues.EARLY;
            returnCreditOverride = dropHelpersLib.enums.ReturnCreditOverrideValues.RETURN;
        }
        if (transactionid) {
            const byTransactionId = { id: transactionid };
            transactions = await dropQueryLib.queryTransactions(byTransactionId);
        } else {
            const byEventIdUserId = { eventid, userid: user.id, status: 1 };
            transactions = await dropQueryLib.queryTransactions(byEventIdUserId);
        }
        if (transactions.length === 0) {
            event = await dropQueryLib.queryEvent({ eventid });
            studio = event.studio;
            const early = dropHelpersLib.isEarlyDrop({ startTime: event.start_date, studio, earlyLateDropOverride });
            const attendees = await models.attendees.findAll({
                where: { userid: user.id, eventid }
            });
            await Promise.map(attendees, async (a) => {
                if (studio.source !== 'zf') {
                    await unenrollmentLib.unenrollUserFromEvents({
                        user,
                        events: [event],
                        sales: [{ saleId: a.saleid, regionId: event.location.region_id }],
                        early
                    });
                } else {
                    await markAttendeeAsDropped({
                        attendeeId: a.saleId,
                        studio,
                        early
                    });
                }
            });
            sendEmail = false;
        }

        let early = true;
        let shouldReturnCredit = true;
        await Promise.map(
            transactions,
            async (transaction) => {
                await sequelize.transaction(async (sqlTransaction) => {
                    let clientid;
                    event = transaction.event;
                    studio = transaction.dibs_studio;
                    early = dropHelpersLib.isEarlyDrop({ startTime: event.start_date, studio, earlyLateDropOverride });
                    shouldReturnCredit = dropHelpersLib.shouldReturnCredit({ early, returnCreditOverride });

                    transaction.description += ` | Begin removal for event ${transaction.eventid}`;
                    if (shouldReturnCredit) {
                        transaction.description += ' | Begin returning credit';
                        await dropLib.returnCredit({ user, refundCharges, transaction, sqlTransaction });
                    }
                    transaction.early_cancel = early;
                    transaction.drop_source = dropSource;
                    transaction.description += ` | Drop is marked as ${early ? 'early' : 'late'}`;
                    clientid = transaction.pass && transaction.pass.clientid;

                    if (studio.source !== 'zf') {
                        await unenrollmentLib.unenrollUserFromEvents({
                            user,
                            studio,
                            transactions: [transaction],
                            sales: [],
                            early,
                            clientid
                        });
                    } else {
                        await markAttendeeAsDropped({
                            attendeeId: transaction.saleid || String(transaction.id),
                            studio,
                            early
                        });
                    }
                    transaction.description += ` | Unenroll from ${studio.source} complete`;
                    return transaction.destroy();
                });
            },
            { concurrency: 1 }
        );

        if (sendEmail) {
            emailLib.sendDropConfirmationEmail({
                user,
                employeeid,
                early,
                transactions,
                creditReturned: shouldReturnCredit,
                refunded: refundCharges,
                classCanceled
            });
            emailLib.sendDropTransactionsEmail({
                user,
                transactions,
                dropSource,
                employeeid,
                early,
                returnCredit: shouldReturnCredit,
                classCanceled
            });
        }

        // const eventInfo = await models.event.findOne({ where: { eventid: eventid } });
        // const prevSpotsBooked = eventInfo.spots_booked;
        // const spotsDropped = transactions.length;
        // const newSpotsBooked = prevSpotsBooked - spotsDropped;

        await Promise.map(transactions, (transaction) =>
            models.event.update(
                {
                    spots_booked: sequelize.literal(`spots_booked - ${Number(transactions.length)}`)
                    // spots_booked: newSpotsBooked
                },
                {
                    where: {
                        eventid: transaction.event.eventid
                    }
                }
            )
        );
        // send json to sweat from home parser (id = 209)
        if (studio.id === 209) {
            const mcNotificationAsync = Promise.promisify(mc.sendEmail, { context: mc });
            const droppedUserJson = [];
            const userInfo = {
                userid: user.id,
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                eventid,
                early,
                dropSource,
                classCanceled,
                refundCharges,
                employeeid
            };
            droppedUserJson.push(userInfo);
            mcNotificationAsync('alicia@ondibs.com', 'User dropped class', JSON.stringify(droppedUserJson));
            mcNotificationAsync('jtuseali@mailparser.io', 'User dropped class', JSON.stringify(droppedUserJson));
        }
        const userJson = await user.studioClientJSON(studio.id);
        await user.reloadAndUpdateRedis();
        return apiSuccessWrapper({ user: userJson, transactions }, 'Successfully dropped events');
    } catch (err) {
        return dropLib.handleDropUserError({ user, event, studio, err, returnResponse: true, employeeid });
    }
}

dropLib.dropUserFromEvent = dropUserFromEvent;
module.exports = dropLib;
