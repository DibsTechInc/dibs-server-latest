const { uniq } = require('lodash');
const MailClient = require('@dibs-tech/mail-client');
const stringifyCart = require('../../purchasing/checkout/helpers/stringify-cart');
const { handleError } = require('../../errors');
const Promise = require('bluebird');

const mc = new MailClient();

/**
 * @param {Object} user who booked
 * @param {Array<Object>} cart they purchased
 * @param {string} purchasePlace where they made the purchase
 * @param {number} employeeid of employee making the purchase
 * @returns {Promise<undefind>} sends email to transactions@ondibs.com
 */
module.exports = async function sendBookingTransactionsEmail(user, cart, purchasePlace, employeeid) {
  const stringifiedCart = stringifyCart(cart);
  try {
    const studioIds = uniq(cart.map(({ event }) => event.dibs_studio_id));
    let body = `User ${user.id} - ${user.email} has been booked at studios ${studioIds.join(', ')}\n\n`;
    if (employeeid) body += `Employee ${employeeid} made the booking on the user's behalf\n\n`;
    body += `Cart: ${stringifiedCart}`;
    await Promise.promisify(mc.transactions).call(mc, `Dibs Booking - ${purchasePlace}`, body);
  } catch (err) {
    handleError({
      opsSubject: 'Transaction Email Error',
      opsBody: `Failed to send an email to transactions@ondibs.com after user ${user.id} made a class purchase`,
      stringifiedCart,
    })(err);
  }
};
