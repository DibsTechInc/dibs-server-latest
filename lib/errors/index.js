const errorHandler = require('@dibs-tech/dibs-error-handler');
const { parse } = require('qs');

/**
 * @param {string} sessionType type of user who encountered the error
 * @param {Express.Request} req the incoming request
 * @param {Express.Response} res response object
 * @returns {undefined}
 */
function handleFrontEndError(sessionType, req, res) {
  const err = parse(req.body);
  const sessionTypes = {
    user: 'User',
    employee: 'Studio Employee',
  };
  let opsIncludes = 'A component failed to render properly.\n';
  if (sessionTypes[sessionType] && req[sessionType]) {
    opsIncludes += `${sessionTypes[sessionType]} ID: ${req[sessionType].id}`;
  }
  errorHandler.handleError({
    opsSubject: `${req.body.app} Front End Error`,
    opsIncludes,
  })(err);
  res.status(204).send();
}

module.exports = {
  ...errorHandler,
  handleFrontEndError,
};
