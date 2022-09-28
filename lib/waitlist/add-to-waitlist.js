const enrollmentLib = require('../booking/enrollment');
const errorLib = require('../errors');
const bookingErrors = require('../errors/booking');
const waitlistEmailLib = require('../emails/waitlist');

/**
 * @param {Object} args argument object
 * @param {Object} args.user user instance trying to add to waitlist
 * @param {number} args.eventid of class user was trying to book
 * @param {Error} args.err the error
 * @returns {Object} API failure response
 */
function handleAddToWaitlistError({ user, eventid, err, employeeid }) {
  switch (err.constructor) {
    case bookingErrors.AddToWaitlistError:
      return bookingErrors.handleBookingError({ user, eventid, err, employeeid });
    default:
      return errorLib.handleError({
        opsSubject: 'Add To Waitlist Error',
        opsIncludes: `Event ${eventid}`,
        userid: user.id,
        returnResponse: true,
        resMessage: 'Uh oh, something went wrong adding you to the waitlist.',
      })(err);
  }
}

/**
 * @param {Object} user being added to the waitlist expected to have
 *                      associations provided in config/passport/include-config.js
 * @param {number} eventid of the class they want to be waitlisted for
 * @param {string} purchasePlace where the route was called
 * @returns {Promise<Object>} resolves API response
 */
module.exports = async function addToWaitlist({ user, eventid, purchasePlace, employeeid }) {
  try {
    const event = await models.event.findById(eventid, {
      include: [
        {
          model: models.dibs_studio,
          as: 'studio',
          include: [{
            model: models.whitelabel_custom_email_text,
            as: 'custom_email_text',
            key: 'dibs_studio_id',
          }],
        },
        {
          model: models.dibs_studio_instructors,
          as: 'instructor',
        },
        {
          model: models.dibs_studio_locations,
          as: 'location',
        },
      ],
    });
    if (!event) throw new Error('No such event');

    const pass = await user.getNextValidPass(event);

    const dibsTransaction = await models.dibs_transaction.newWaitlistTransaction({
      user,
      event,
      pass,
      purchasePlace,
      save: true,
      employeeid,
    });

    const waitlistId = await enrollmentLib.addToWaitlist(user, event, pass);

    await sequelize.transaction(async (sqlTransaction) => {
      if (pass && !pass.source_serviceid) await pass.addUses(1, { save: true, transaction: sqlTransaction });
      await dibsTransaction.setWaitlistId(waitlistId)
                           .success({ save: true, transaction: sqlTransaction });
    });

    waitlistEmailLib.sendAddToWaitlistEmail(user, event);
    await user.reloadAndUpdateRedis();
    return apiSuccessWrapper({ user: user.clientJSON(), dibsTransaction });
  } catch (err) {
    return handleAddToWaitlistError({ user, eventid, err, employeeid });
  }
};
