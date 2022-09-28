const Promise = require('bluebird');
const MBClient = require('@dibs-tech/mindbody-client');
const errorHelper = require('../../errors');

/**
 * Abstracted clientid adder
 * @param {object} response mindbody response
 * @param {object} userStudio instance
 * @returns {Promise<object>} user after update
 */
function addClientId(response, userStudio) {
  const Client = response.Clients.Client[0];
  userStudio.clientid = Client.ID;
  return userStudio.save();
}

/**
 * @param {object} user instance
 * @param {object} userStudio instance
 * @param {object} studio instance
 * @returns {undefined}
 */
module.exports = async function associateToMBStudio(user, userStudio, studio) {
  try {
    const mbc = new MBClient(
      process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, studio.studioid);
    const { GetClientsResult: getResponse } =
      await Promise.promisify(mbc.getSingleClient, { context: mbc })(user.email);

    if (getResponse.Clients !== null) {
      await addClientId(getResponse, userStudio);
      return userStudio;
    }

    const { AddOrUpdateClientsResult: addResponse } =
      await Promise.promisify(mbc.addUserToStudio, { context: mbc })(
        user, { SendEmail: studio.dibs_config.send_source_welcome_email });
    await addClientId(addResponse, userStudio);

    return userStudio;
  } catch (err) {
    return errorHelper.handleError({
      opsSubject: 'New User Studio Signup Error',
      opsIncludes: `User: ${user.id}, Studio: ${studio.id}`,
    })(err);
  }
};
