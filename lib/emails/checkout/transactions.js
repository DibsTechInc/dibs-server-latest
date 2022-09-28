const { uniq } = require('lodash');
const MailClient = require('@dibs-tech/mail-client');
const stringifyCart = require('../../purchasing/checkout/helpers/stringify-cart');
const { handleError } = require('../../errors');
const Promise = require('bluebird');

const mc = new MailClient();

const mcTransactionAsync =
  Promise.promisify(mc.transactions, { context: mc });

const mcNotificationAsync =
  Promise.promisify(mc.sendEmail, {context: mc});

const toTitleCase = str =>
  str.split('').reduce(
    (acc, c, i) => {
      if (i === 0) return c.toUpperCase();
      if (c === c.toLowerCase()) return acc + c;
      return `${acc} ${c}`;
    }, '');

const getItemString = itemType =>
  (itemType === 'events' ?
    'Booking' : `${toTitleCase(itemType.slice(0, -1))} Purchase`);

/**
 * @param {Object} cart user checked out
 * @param {string} purchasePlace where user made purchase
 * @returns {string} subject line for the transactions email
 */
function getTransactionEmailSubject(cart, purchasePlace) {
  const productStr = Object.entries(cart).reduce(
    (acc, [itemType, items]) => {
      if (!acc && items.length) return `Dibs ${getItemString(itemType)}`;
      if (items.length) return 'Dibs Purchase';
      return acc;
    },
    ''
  );
  return `${productStr} - ${purchasePlace}`;
}

/**
 * @param {Object} user who booked
 * @param {Object} cart they purchased
 * @param {string} purchasePlace where they made the purchase
 * @param {number} employeeid who made the purchase on their behalf
 * @param {string} checkoutUUID id of checkout for cart
 * @returns {Promise<undefined>} sends email to transactions@ondibs.com
 */
module.exports = async function sendBookingTransactionsEmail({
  user,
  cart,
  purchasePlace,
  employeeid,
  checkoutUUID,
}) {
  const stringifiedCart = stringifyCart(cart);
  try {
    const studioIds = uniq([
      ...cart.events.map(item => item.dibsTransaction.dibs_studio_id),
      ...cart.packages.map(item => item.dibsTransaction.dibs_studio_id),
      ...cart.credits.map(item => item.dibsTransaction.dibs_studio_id),
      ...cart.giftCards.map(item => item.dibsTransaction.dibs_studio_id),
    ]).sort((a, b) => a - b);
    let body = `User ${user.id} - ${user.email} has made a purchase at ${studioIds.join(', ')}\n\n`;
    if (employeeid) body += `Employee ${employeeid} made the booking on the user's behalf\n\n`;
    body += `Checkout ID: ${checkoutUUID}\n\n`;
    body += `Cart: ${stringifiedCart}`;

    const userData = {
      user: [
        {
          userid: user.id,
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
          mobilephone: user.mobilephone,
        },
      ]
    };
    
    const cartObj = JSON.parse(stringifiedCart);

    const newCartData = [];
    newCartData.push(userData);

    newCartData.push(cartObj);

    const newCartDataJSON = JSON.stringify(newCartData);

    await mcTransactionAsync(
      getTransactionEmailSubject(cart, purchasePlace), body);

    console.log(`/n/nStudioIds v6625 = ${studioIds}`);
    // send an email to sweat from home when someone makes a transaction
    if (studioIds == 209) {
      console.log(`/n/n`);
      let studioNotificationBody = `${user.email} has made a purchase.`;
      studioNotificationBody += `\n\n${newCartDataJSON}`;
      console.log(`message is => /n/n${studioNotificationBody}`);
      // Object.packages(empty).length === 0 && empty.constructor === Object
      console.log(`events ==> ${newCartData[1].events.length}`);
      console.log(`packages ==> ${newCartData[1].packages.length}`);
      if (newCartData[1].events.length >= 1) {
        // await mcNotificationAsync(
        //   'wvnyryt3@robot.zapier.com',
        //   getTransactionEmailSubject(cart, purchasePlace),
        //   studioNotificationBody);
        await mcNotificationAsync(
          'alicia@ondibs.com',
          getTransactionEmailSubject(cart, purchasePlace),
          studioNotificationBody);
        await mcNotificationAsync(
          'ixcbszuv@mailparser.io',
          getTransactionEmailSubject(cart, purchasePlace),
          studioNotificationBody);
      }
      if (newCartData[1].packages.length >= 1) {

        const packageName = {
          nameOfPackage: cart.packages[0].studioPackage.name,
        };
        const packageCartData = [];
        packageCartData.push(packageName);
        packageCartData.push(userData);
        packageCartData.push(cartObj);
        packageCartData.push()
        console.log(`\n\npackageCartData JSON printed out AGAIN ---> \n`);
        console.log(JSON.stringify(packageCartData));
        console.log(`\n\n`);
        const newPackageCartDataJSON = JSON.stringify(packageCartData);
        let studioPackageNotificationBody = `${user.email} has made a package purchase.`;
        studioPackageNotificationBody += `\n\n${newPackageCartDataJSON}`;
        console.log(`message is => /n/n${studioPackageNotificationBody}`);
        // await mcNotificationAsync(
        //   'i8q46akk@robot.zapier.com',
        //   getTransactionEmailSubject(cart, purchasePlace),
        //   studioPackageNotificationBody);
        await mcNotificationAsync(
          'alicia@ondibs.com',
          getTransactionEmailSubject(cart, purchasePlace),
          studioPackageNotificationBody);
        await mcNotificationAsync(
          'npwlqdcs@mailparser.io',
          getTransactionEmailSubject(cart, purchasePlace),
          studioPackageNotificationBody);
      }
    }
  } catch (err) {
    handleError({
      opsSubject: 'Transaction Email Error',
      opsBody: `Failed to send an email to transactions@ondibs.com after user ${user.id} made a class purchase`,
      stringifiedCart,
    })(err);
  }
};
