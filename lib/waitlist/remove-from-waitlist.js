const unenrollmentLib = require('../booking/unenrollment');
const errorLib = require('../errors');
const bookingErrors = require('../errors/booking');

/**
 * @param {Object} args argument object
 * @param {Object} args.user user instance trying to add to waitlist
 * @param {number} args.eventid of class user was trying to book
 * @param {Error} args.err the error
 * @returns {Object} API failure response
 */
function handleRemoveFromWaitlistError({ err, user, eventid }) {
  switch (err.constructor) {
    case bookingErrors.RemoveFromWaitlistError:
      return bookingErrors.handleBookingError({ err, user, eventid });
    default:
      return errorLib.handleError({
        userid: user.id,
        opsSubject: 'Remove From Waitlist Error',
        opsIncludes: `Waitlist for event ${eventid}`,
        resMessage: 'Uh oh, something went wrong removing you from the waitlist.',
        returnResponse: true,
      })(err);
  }
}

module.exports = async function removeFromWaitlist(user, eventid) {
  try {
    const dibsTransaction = await models.dibs_transaction.findOne({
      where: {
        userid: user.id,
        eventid,
        type: models.dibs_transaction.Types.WAITLIST,
      },
      include: [{
        model: models.passes,
        as: 'pass',
      }, {
        model: models.event,
        as: 'event',
        include: [{
          model: models.dibs_studio_locations,
          as: 'location',
        }],
      }, {
        model: models.dibs_studio,
        as: 'dibs_studio',
      }],
    });
    if (!dibsTransaction) throw new Error('No such waitlist transaction');

    if (dibsTransaction.source === 'mb') {
      await unenrollmentLib.removeFromWaitlist(user, dibsTransaction);
    }
   

    dibsTransaction.description += ' | Removing user from waitlist';
    if (dibsTransaction.pass && !dibsTransaction.pass.source_serviceid) {
      await sequelize.transaction(async (sqlTransaction) => {
        await dibsTransaction.pass.returnUses(1, { save: true, transaction: sqlTransaction });
        await dibsTransaction.destroy({ transaction: sqlTransaction });
      });
    } else await dibsTransaction.destroy();

    await user.reloadAndUpdateRedis();

    return apiSuccessWrapper({ dibsTransaction, user: user.clientJSON() }, 'Successfully removed from the waitlist');
  } catch (err) {
    return handleRemoveFromWaitlistError({ err, user, eventid });
  }
};
