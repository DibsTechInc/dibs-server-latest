const { Expo } = require('expo-server-sdk');
const MailClient = require('@dibs-tech/mail-client');

const mc = new MailClient();

const {
  ErrorDetailTypes,
  DEVICE_NOT_REGISTERED_ERROR,
  MESSAGE_RATE_EXCEEDED,
  MESSAGE_TOO_BIG,
  INVALID_CREDENTIALS,
  UNKNOWN_ERROR,
} = require('./constants');

/**
 * @class PushNotificationsClient
 */
class PushNotificationsClient {
  /**
   * @constructor
   * @constructs PushNotificationsClient
   * @param {Object} props for component
   */
  constructor() {
    this.expo = new Expo();
    this.messages = [];
    this.tickets = [];
    this.receiptIds = [];
  }

  /**
  * @typedef payload {Object}
  * @property title {string}
  * @property message {string}
  */

  /**
   * @method prepPushNotifications
   * @param {Array} pushTokenInfo an array of objects
   * @returns {undefined}
   */
  prepPushNotifications(pushTokenInfo) {
    pushTokenInfo.forEach((tokenInfo) => {
      const {
        pushToken,
        title,
        body,
      } = tokenInfo;

      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
      }

      this.messages.push({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: { title, body },
      });
    });
  }

  /**
   * @method sendPushNotifications
   * @returns {undefined}
   */
  sendPushNotifications() {
    const notifications = this.messages;
    const expo = this.expo;
    const tickets = this.tickets;

    const messageChunks = expo.chunkPushNotifications(notifications);

    messageChunks.forEach(async (chunk) => {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * @method processNotificationReceipts
   * @returns {undefined}
   */
  processNotificationReceipts() {
    const tickets = this.tickets;
    const receiptIds = this.receiptIds;
    const expo = this.expo;

    tickets.forEach((ticket) => {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    });

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    receiptIdChunks.forEach(async (chunk) => {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        this.handleReceiptError(receipts);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * @method processNotificationReceipts
   * @param {Array} receipts - receipt array from each individual receipt chunk
   * @returns {undefined}
   */
  handleReceiptError(receipts) {
    receipts.forEach((receipt) => {
      if (receipt.status === 'error') {
        console.error(`There was an error sending a notification: ${receipt.message}`);
        if (receipt.details && receipt.details.error) {
          this.handleDetailError(receipt.details.error);
        }
      }
    });
  }

  /**
   * @method handleDetailError
   * @param {string} errorDetail - specific error detail from apple/google servers
   * @returns {undefined}
   */
  handleDetailError(errorDetail) {
    switch (errorDetail) {
      case ErrorDetailTypes.DeviceNotRegistered:
        console.error(DEVICE_NOT_REGISTERED_ERROR);
        mc.ops(ErrorDetailTypes.DeviceNotRegistered, DEVICE_NOT_REGISTERED_ERROR);
        return;
      case ErrorDetailTypes.MessageTooBig:
        console.error(MESSAGE_TOO_BIG);
        mc.ops(ErrorDetailTypes.MessageTooBig, MESSAGE_TOO_BIG);
        return;
      case ErrorDetailTypes.MessageRateExceeded:
        console.error(MESSAGE_RATE_EXCEEDED);
        mc.ops(ErrorDetailTypes.MessageRateExceeded, MESSAGE_RATE_EXCEEDED);
        return;
      case ErrorDetailTypes.InvalidCredentials:
        console.error(INVALID_CREDENTIALS);
        mc.ops(ErrorDetailTypes.InvalidCredentials, INVALID_CREDENTIALS);
        return;
      default:
        console.error(UNKNOWN_ERROR);
    }
  }
}

module.exports = PushNotificationsClient;
