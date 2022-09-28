const { validateCart } = require('./validate-cart');
const stringifySafe = require('json-stringify-safe');
const { omit } = require('lodash');

/**
 * @param {Array<Object>} cart being purchased when error occurred
 * @returns {string} stringified cart
 */
function stringifyCartArray(cart) {
  return JSON.stringify(
    cart.map(({ promoCode, flashCredit, event, dibsTransaction, pass, ...cartItem }) => ({
      ...cartItem,
      flashCredit: flashCredit && flashCredit.id,
      promoCode: promoCode && promoCode.id,
      eventid: event ? event.eventid : cartItem.eventid,
      dibsTransaction: dibsTransaction && dibsTransaction.id,
      passid: pass ? pass.id : cartItem.passid,
    }))
      .reduce((acc, cartItem) => {
        const foundItem = acc.find(({ eventid, passid }) => cartItem.eventid === eventid && cartItem.passid === passid);
        if (foundItem) foundItem.quantity += 1;
        else acc.push({ ...cartItem, quantity: 1 });
        return acc;
      }, []),
    null,
    2
  );
}

/**
 * @param {Object} cart being purchased when error occurred (new format)
 * @returns {string} stringified cart
 */
function stringifyCart(cart) {
  try {
    cart = validateCart(cart);
  } catch (_) {
    return stringifySafe(cart);
  }
  return JSON.stringify({
    events: cart.events.map(({ promoCode, flashCredit, event, dibsTransaction, pass, ...cartItem }) => ({
      ...cartItem,
      flashCredit: flashCredit && flashCredit.id,
      promoCode: promoCode && promoCode.id,
      eventid: event ? event.eventid : cartItem.eventid,
      dibsTransaction: dibsTransaction && dibsTransaction.id,
      passid: pass ? pass.id : cartItem.passid,
    })).reduce((acc, cartItem) => {
      const foundItem = acc.find(({ eventid, passid }) => cartItem.eventid === eventid && cartItem.passid === passid);
      if (foundItem) foundItem.quantity += 1;
      else acc.push({ ...cartItem, quantity: 1 });
      return acc;
    }, []),

    packages: cart.packages.map(({ promoCode, dibsTransaction, pass, studioPackage, ...cartItem }) => ({
      ...cartItem,
      promoCode: promoCode && promoCode.id,
      dibsTransaction: dibsTransaction && dibsTransaction.id,
      pass: pass ? pass.id : null,
      studioPackage: studioPackage ? studioPackage.id : null,
    })).reduce((acc, cartItem) => {
      const foundItem = acc.find(({ packageid }) => cartItem.packageid === packageid);
      if (foundItem) foundItem.quantity += 1;
      else acc.push({ ...cartItem, quantity: 1 });
      return acc;
    }, []),

    credits: cart.credits.map(({ dibsTransaction, creditTier, ...cartItem }) => ({
      ...cartItem,
      creditTier: creditTier && creditTier.id,
      dibsTransaction: dibsTransaction && dibsTransaction.id,
    })),

    giftCards: cart.giftCards.map(({ dibsTransaction, giftCard, ...cartItem }) => ({
      ...omit(cartItem, 'studio'),
      giftCard: giftCard && giftCard.id,
      dibsTransaction: dibsTransaction && dibsTransaction.id,
    })),
  }, null, 2);
}

module.exports = cart => (
  Array.isArray(cart) ?
    stringifyCartArray(cart)
    : stringifyCart(cart)
);
