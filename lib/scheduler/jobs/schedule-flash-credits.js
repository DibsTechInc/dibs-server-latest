const axios = require('axios');
const { handleError } = require('../../../lib/helpers/error-helper');

const FLASH_CREDIT_AUTOMATOR_ORIGIN = process.env.NODE_ENV === 'production' ? 'https://flash-credit-automator.herokuapp.com' : 'http://127.0.0.1:3001';

/**
 * onScheduleFlashCredits
 * @param {kue.Job} job an instance of kue's Job class
 * @param {function} done the callback for completion
 * @returns {undefined}
 */
function onScheduleFlashCredits({ data }, done) {
  axios.post(`${FLASH_CREDIT_AUTOMATOR_ORIGIN}/csv`, data)
       .then(() => done())
       .catch(handleError({
         opsSubject: 'Flash Credit Scheduler Job Error',
         callback: done,
       }));
}

module.exports = onScheduleFlashCredits;
