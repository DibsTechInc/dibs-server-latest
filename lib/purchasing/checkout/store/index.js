const MailClient = require('@dibs-tech/mail-client');

const mc = new MailClient();
const store = new Map();


/**
 * @param {string} body of ops email
 * @returns {undefined}
 */
function sendOpsError(body) {
  mc.ops('Purchasing Error', body);
}

/**
 * @param {string} checkoutUUID of checkout being recorded
 * @param {string} body of message in addition to including checkoutUUId
 * @returns {undefined}
 */
function sendInactiveCheckoutError(checkoutUUID, body) {
  sendOpsError(
    `Our purchasing library attempted to mark an inactive checkout ID: ${checkoutUUID} ${body}`);
}

/**
 * @param {string} checkoutUUID of checkout being recorded
 * @param {number|string} dibsStudioId of the studio the studio checkout is for
 * @param {string} body of message in addition to including checkoutUUId
 * @returns {undefined}
 */
function sendInactiveStudioCheckoutError(checkoutUUID, dibsStudioId, body) {
  sendOpsError(
    `Our purchasing library attempted mark an inactive studio checkout, checkout ID: ${checkoutUUID} `
    + `studio id: ${dibsStudioId} ${body}`);
}

/**
 * @returns {Object} default purchasing state of a studio checkout
 */
function getDefaultStudioPurchaseState() {
  return {
    startedEnrollment: false,
    enrolled: false,
    charged: false,
    sqlTransactionComitted: false,
    receiptSent: false,
  };
}

/**
 * @param {Object} state of studio purchase
 * @param {string} field to set to true
 * @returns {Object} mew state
 */
function setStudioPurchaseState(state, field) {
  return { ...state, [field]: true };
}

/**
 * @param {string} field to update in the studio's state, first arg because this fn will be used with bind
 * @param {string} checkoutUUID of checkout to modify state for
 * @param {string|number} dibsStudioId of studio to modify state for
 * @returns {undefined}
 */
function setStudioCheckout(field, checkoutUUID, dibsStudioId) {
  const checkout = store.get(checkoutUUID);
  if (!checkout) {
    sendInactiveCheckoutError(
      checkoutUUID,
      `as having completed enrollment for studio: ${dibsStudioId}.`);
  } else if (!checkout.studioCheckouts[dibsStudioId]) {
    sendInactiveStudioCheckoutError(
      checkoutUUID, dibsStudioId, 'as having completed enrollment.');
  } else {
    checkout.studioCheckouts[dibsStudioId] =
      setStudioPurchaseState(checkout.studioCheckouts[dibsStudioId], field);
    store.set(checkoutUUID, checkout);
  }
}


module.exports = {
  /**
   * @param {string} checkoutUUID of checkout being recorded
   * @param {Object} cart being checked out
   * @returns {undefined}
   */
  addActiveCheckout(checkoutUUID, cart) {
    store.set(checkoutUUID, { cart, studioCheckouts: {} });
  },
  /**
   * @param {string} checkoutUUID of checkout being recorded
   * @param {number|string} dibsStudioId of studio we are adding an active checkout at
   * @returns {undefined}
   */
  addActiveStudioCheckout(checkoutUUID, dibsStudioId) {
    const checkout = store.get(checkoutUUID);
    if (!checkout) {
      sendInactiveCheckoutError(
        checkoutUUID, `as starting a checkout at studio id: ${dibsStudioId}.`);
    } else if (checkout.studioCheckouts[dibsStudioId]) {
      sendOpsError(
        `Our purchasing library attempted mark a checkout ID: ${checkoutUUID} `
        + `as starting a checkout at studio id: ${dibsStudioId} twice.`
      );
    } else {
      checkout.studioCheckouts[dibsStudioId] = getDefaultStudioPurchaseState();
      store.set(checkoutUUID, checkout);
    }
  },

  setStudioCheckoutStartedEnrollment: setStudioCheckout.bind(null, 'startedEnrollment'),
  setStudioCheckoutEnrolled: setStudioCheckout.bind(null, 'enrolled'),
  setStudioCheckoutCharged: setStudioCheckout.bind(null, 'charged'),
  setStudioCheckoutCommitted: setStudioCheckout.bind(null, 'sqlTransactionComitted'),
  setStudioCheckoutReceiptSent: setStudioCheckout.bind(null, 'receiptSent'),

  /**
   * @param {string} checkoutUUID of checkout completed
   * @returns {undefined}
   */
  completeActiveCheckout(checkoutUUID) {
    if (!store.delete(checkoutUUID)) {
      sendInactiveCheckoutError(checkoutUUID, 'as complete.');
    }
  },

  /**
   * @returns {Array<string>} checkoutUUIDs currently active, returns null if there are none
   */
  getActiveCheckouts() {
    if (!store.size) return null;
    return [...store];
  },
};
