const Enum = require('enum');

const ErrorDetailTypes = new Enum([
  'DeviceNotRegistered',
  'MessageTooBig',
  'MessageRateExceeded',
  'InvalidCredentials',
]);

const DEVICE_NOT_REGISTERED_ERROR = 'The device cannot receive push notifications anymore. Please stop sending messages to the corresponding Expo token';
const MESSAGE_TOO_BIG = 'The total notification payload was too large. Android and iOS payloads must be at most 4096 bytes.';
const MESSAGE_RATE_EXCEEDED = 'You are sending messages too frequently to the given device. Implement exponential backoff and slowly retry sending messages.';
const INVALID_CREDENTIALS = 'Your push notification credentials for this app are invalid. You may have revoked them. Run "expo build:ios -c" to regenerate new push notification credentials for iOS';
const UNKNOWN_ERROR = 'An unknown error has occured.';

module.exports = {
  ErrorDetailTypes,
  DEVICE_NOT_REGISTERED_ERROR,
  MESSAGE_TOO_BIG,
  MESSAGE_RATE_EXCEEDED,
  INVALID_CREDENTIALS,
  UNKNOWN_ERROR,
};
