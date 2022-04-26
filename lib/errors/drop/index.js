const types = require('./types');
const { handleError } = require('../index');
const handlers = require('./handlers');

/**
 * @param {Object}        args passed to function
 * @param {Object}        args.user making the drop
 * @param {DropError} args.err that was thrown in code
 * @param {Object}        args.studio the studio where the classes being dropped are
 * @param {Object}        args.employeeid of the employee who dropepd teh user
 * @returns {Object} failure response json
 */
function handleDropError({
  user,
  err,
  studio,
  returnResponse,
  employeeid,
}) {
  switch (err.constructor) {
    case types.ReturnCreditError:
      return handlers.handleReturnCreditError({ user, err, studio, returnResponse, employeeid });
    default:
      return handleError({
        opsSubject: 'Drop Error: Unexpected Error',
        userid: user.id,
        employeeid,
        returnResponse,
      })(err);
  }
}

module.exports = {
  ...types,
  handleDropError,
};
