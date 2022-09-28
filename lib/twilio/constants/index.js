const DIBS_US_NUMBER = '+16467603427';
const DIBS_STAGING_NUMBER = '+16463551307';
const DIBS_UK_NUMBER = '+442033898689';

const DIBS_GREETING_URL = 'https://s3.amazonaws.com/dibs-phone-audio/voicemail.mp3';

const DIBS_SMS_LIST = ((process.env.NODE_ENV === 'production' ? process.env.DIBS_SMS_LIST : process.env.DEV_NUMBER) || '').split(';');
const DIBS_PHONE_LIST = ((process.env.NODE_ENV === 'production' ? process.env.DIBS_PHONE_LIST : process.env.DEV_NUMBER) || '').split(';');

module.exports = {
  DIBS_US_NUMBER,
  DIBS_STAGING_NUMBER,
  DIBS_UK_NUMBER,
  DIBS_GREETING_URL,
  DIBS_SMS_LIST,
  DIBS_PHONE_LIST,
};
