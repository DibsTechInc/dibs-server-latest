const stringify = require('json-stringify-safe');
const LogEntryClient = require('./lib/logentries');
const { compareTwoStrings } = require('string-similarity');
const { apiFailureWrapper, apiSuccessWrapper } = require('./lib/api-wrappers');
const MailClient = require('../dibs-mail-client');

const mc = new MailClient();

/**
 * @class AsyncError
 */
class AsyncError extends Error {
  /**
   * constructor
   * @constructs ErrorAsync
   * @param {Error} err the original error
   * @param {string} reason for the error
   */
  constructor(err, reason) {
    super();
    this.originalError = err;
    this.reason = reason;
  }
}

/**
 * rejectAsyncError
 * @param {string} reason for the error
 * @returns {function} callback for Promise.catch()
 */
function rejectAsyncError(reason) {
  return err => (
    err instanceof AsyncError ?
      Promise.reject(err)
      : Promise.reject(new AsyncError(err, reason))
  );
}

/**

HANDLE ERROR

**/

const DEFAULT_HANDLE_ERROR_OPTIONS = {
  opsSubject: null,
  opsBody: '',
  opsIncludes: '',
  forceOpsEmail: false,
  res: null,
  successResponse: false,
  resJson: null,
  resRender: null,
  resStatus: null,
  resMessage: null,
  resSend: false,
  exitProcess: false,
  callback: null,
  userid: null,
  employeeid: null,
  logEntryQuery: process.env.DYNO,
  log: true,
  stringifiedCart: '',
  returnResponse: false,
};

/**
 * validateHandleErrorOptions so if handleError is called incorrectly
 * @param {Object} options handleError was called with
 * @returns {Object} result of the test, tells you the wrong key and offers a suggestion
 */
function validateHandleErrorOptions(options) {
  const validOptions = Object.keys(DEFAULT_HANDLE_ERROR_OPTIONS);
  const argumentIsValid = Object.keys(options).reduce((acc, option) => acc && validOptions.includes(option), true);
  let wrongKey;
  let suggestion;

  if (!argumentIsValid) {
    let maxScore = 0;
    wrongKey = Object.keys(options).filter(option => !validOptions.includes(option))[0];
    validOptions.forEach((validOption) => {
      const score = compareTwoStrings(validOption, wrongKey);
      if (score > maxScore) {
        maxScore = score;
        suggestion = validOption;
      }
    });
  }

  return {
    argumentIsValid,
    wrongKey,
    suggestion,
  };
}

/**
 * @param {Error|Object} error that was thrown
 * @returns {string} the error formatted for ops email
 */
function stringifyError(error) {
  switch (true) {
    case (Boolean(error.stack)):
      return error.stack;
    case (
      typeof error.toString === 'function'
      && error.toString()
      && error.toString() !== '[object Object]'
    ):
      return error.toString();
    default:
      return stringify(error, null, 2);
  }
}

/**
 * handleError
 * @param {Object} options determines how error is handled
 * @param {string} options.opsSubject subject of ops email
 * @param {string} options.opsBody first line of the body of the email
 * @param {string} options.opsIncludes a line of text in the ops email with extra information
 * @param {boolean} options.forceOpsEmail boolean determines if ops email is forced to send
 * @param {Express.Response} options.res HTTP response, do not include if you do not want the handler to send a response
 * @param {boolean} options.successResponse flags if the response is a success or failure response, default is failure
 * @param {Object} options.resJson the JSON response (otherwise just contains error)
 * @param {string} options.resMessage the message property of the response
 * @param {string} options.resRender if exists, instructs route to render view
 * @param {number} options.resStatus if exists, sets the response status
 * @param {boolean} options.exitProcess if true, exits Node process
 * @param {function} options.callback a callback that will be executed on error
 * @param {number} options.userid of the user the API failed for
 * @param {number} options.employeeid of the studio-admin user
 * @param {string} options.logEntryQuery a customizeable query to search logentries for
 * @param {boolean} options.log will not console.log the error if set to false, defaults true
 * @param {string} options.stringifiedCart from an error during a class purchase
 * @returns {function} callback for Promise.catch() at the bottom of the chain
 */
function handleError(options = DEFAULT_HANDLE_ERROR_OPTIONS) {
  const {
    opsSubject = null,
    opsBody = '',
    opsIncludes = '',
    forceOpsEmail = false,
    res = null,
    successResponse = false,
    resJson = null,
    resMessage = null,
    resRender = null,
    resStatus = null,
    resSend = false,
    exitProcess = false,
    callback = null,
    userid = null,
    employeeid = null,
    logEntryQuery = process.env.DYNO,
    log = true,
    stringifiedCart = '',
    returnResponse = false,
  } = options;
  const {
    argumentIsValid,
    wrongKey,
    suggestion,
  } = validateHandleErrorOptions(options);
  return (err) => {
    if (!argumentIsValid) {
      console.log(err);
      mc.ops('API Error', `Warning: Error helper module may not be reporting an error. The invalid option, '${wrongKey}' was used, ${suggestion ? `did you mean '${suggestion}'?` : 'not sure what you meant.'}.\n\nError: ${stringifyError(err)}`);
      return null;
    }

    let reason;
    let error;

    if (err instanceof AsyncError) {
      reason = err.reason;
      error = err.originalError;
    } else {
      reason = err.message;
      error = err;
    }

    if (log) console.log(error);
    if (stringifiedCart) console.log(stringifiedCart);

    const apiWrapper = successResponse ? apiSuccessWrapper : apiFailureWrapper;
    const defaultJson = { err: error };
    const responseJSON = apiWrapper(resJson ? { ...defaultJson, ...resJson } : defaultJson, resMessage || 'Something went wrong.');

    if (opsSubject) {
      const lec = new LogEntryClient();
      let opsEmailBody = opsBody ? `${opsBody}\n` : '';
      opsEmailBody += `${reason}.${reason !== err.message ? ` ${err.message}` : ''}\n`;
      opsEmailBody += opsIncludes ? `${opsIncludes}\n` : '';
      opsEmailBody += userid ? `User Id ${userid}\n` : '';
      opsEmailBody += employeeid ? `Studio Employee Id ${employeeid}\n` : '';
      opsEmailBody += stringifiedCart ? `\nCart: ${stringifiedCart}\n` : '';
      opsEmailBody += `\nEnvironment: ${(process.env.STAGING && 'staging') || (process.env.NODE_ENV === 'production' && 'production') || 'development'}\n`;
      opsEmailBody += `\nError: ${stringifyError(error)}`;
      opsEmailBody += `\nLogEntries: ${lec.linkToLog(logEntryQuery)}`;
      mc.ops(opsSubject, opsEmailBody, forceOpsEmail);
    }
    if (returnResponse) return responseJSON;
    if (res && resStatus) res.status(resStatus);
    if (res && resRender) {
      res.render(resRender);
    } else if (res && resSend) {
      res.send();
    } else if (res) {
      res.json(responseJSON);
    } else if (exitProcess) {
      process.exit(1);
    }

    if (callback && typeof callback === 'function') callback();
    return null;
  };
}

module.exports = {
  AsyncError,
  rejectAsyncError,
  stringifyError,
  handleError,
};
