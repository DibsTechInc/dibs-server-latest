const { uniq } = require('lodash');
const { PassValidationError } = require('../../../errors/purchasing');
const buildPassStartDateCount = require('./build-pass-use-count');
const Promise = require('bluebird');
const moment = require('moment');

module.exports = async function validateAndAssociatePasses(user, cart) {
  if (cart.events.every(({ passid }) => !passid)) return cart; // also handles empty cart case
  try {
    const passids = uniq(cart.events.map(({ passid }) => passid).filter(Boolean));
    const passes = await models.passes.findAll({
      where: { id: passids },
      include: [{
        model: models.studio_packages,
        as: 'studioPackage',
      }, {
        model: models.dibs_user_autopay_packages,
        as: 'userAutopayPackage',
      }],
    });
    const passStartDateCartCount = buildPassStartDateCount(cart.events);
    return {
      ...cart,
      events: await Promise.map(
        cart.events,
        async (item) => {
          if (!item.passid) return item;
          try {
            if (!item.event.can_apply_pass) throw new PassValidationError(`Event ${item.eventid} cannot be booked with a pass.`, { passid: item.passid });
            if (item.price === 0) throw new PassValidationError(`Event ${item.eventid} cannot be booked with a pass since its price is zero.`, { passid: item.passid });
            const usageCount = passStartDateCartCount[item.passid][moment(item.event.start_date).dayOfYear()];
            const pass = passes.find(({ id }) => item.passid === id);
            if (!pass.isValidForUseAtStudio(item.event.dibs_studio_id)) {
              throw new PassValidationError('That pass is no longer available for use.', { invalidPass: true, passid: item.passid });
            }
            if (await pass.reachedDailyUsageLimit(item.event.start_date, usageCount)) {
              throw new PassValidationError('That pass is has reached its daily usage limit.', { invalidPass: true, passid: item.passid });
            }
            if (pass.isBookingIntoNextMonth(item.event.start_date)) {
              return ({ ...item, pass, unpaid: true });
            }
            return ({ ...item, pass });
          } catch (err) {
            if (err instanceof PassValidationError) throw err;
            throw new PassValidationError(err, { passid: item.passid });
          }
        },
        { concurrency: 1 }
      ),
    };
  } catch (err) {
    if (err.constructor === PassValidationError) throw err;
    throw new PassValidationError(err);
  }
};
