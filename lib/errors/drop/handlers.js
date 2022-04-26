const { handleError } = require('../index');


module.exports = {
  /**
   * @param {Object} args argument object
   * @param {Object} args.user instance who tried to go on the waitlist
   * @param {Object} args.eventid eventid of the event of that class
   * @param {Error} args.err the error
   * @param {number} args.employeeid id of employee acting on users behalf
   * @returns {Object} API failure response
   */
  handleReturnCreditError({ user, err, studio, eventid, employeeid }) {
    handleError({
      opsSubject: 'Drop Error',
      opsIncludes: `Return credit error for user ${user.id} and event ${eventid} at studio ${studio.id}`,
      userid: user.id,
      employeeid,
    })(err);
    return apiFailureWrapper({}, 'Sorry, something went wrong dropping you from that class.');
  },
};
