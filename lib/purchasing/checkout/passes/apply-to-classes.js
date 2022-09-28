const moment = require('moment');
const Promise = require('bluebird');
const { PassApplicationError } = require('../../../errors/purchasing');

module.exports = async function applyPassesToClasses(cart, sqlTransaction) {
  if (cart.events.every(item => !item.passid || item.unpaid)) return cart;
  try {
    const passes = cart.events.reduce((acc, item) => {
      if (!item.passid || item.unpaid) return acc;
      if (acc[item.passid]) {
        acc[item.passid].uses += 1;
        acc[item.passid].events.push({ event: item.event, dibsTransactionId: item.dibsTransaction.id });
        return acc;
      }
      acc[item.passid] = {
        pass: item.pass,
        uses: 1,
        events: [{ event: item.event, dibsTransactionId: item.dibsTransaction.id }],
      };
      return acc;
    }, {});
    await Promise.map(Object.entries(passes), async ([passid, { pass, uses, events }]) => {
      try {
        pass = await pass.addUses(uses, {
          save: true,
          transaction: sqlTransaction,
        });
        if (pass.studioPackage.expires_after_first_booking) {
          const { event, dibsTransactionId } = events.sort((a, b) => moment(a.event.start_date) - moment(b.event.start_date))[0];
          pass = await pass.setExpirationFromEvent({
            event,
            dibsTransactionId,
            save: true,
            transaction: sqlTransaction,
          });
        }
      } catch (err) {
        throw new PassApplicationError(err, { passid: +passid });
      }
    });
    return {
      ...cart,
      events: cart.events.map(item => ({
        ...item,
        pass: ((item.passid && (!item.unpaid)) ?
          passes[item.passid].pass : null),
      })),
    };
  } catch (err) {
    if (err instanceof PassApplicationError) throw err;
    throw new PassApplicationError(err);
  }
};
