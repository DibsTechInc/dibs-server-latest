const ZFClient = require('@dibs-tech/zingfit-client');
const errorHelper = require('../../errors');

/**
 * @param {object} user instance
 * @param {object} userStudio instance
 * @param {object} studio instance
 * @returns {undefined}
 */
module.exports = async function associateToZFStudio(user, userStudio, studio) {
  try {
    return userStudio;
    // const zfc = new ZFClient(
    //   studio.client_id, studio.client_secret, studio.dibs_config.default_region);

    // let customer;

    // customer = await zfc.getCustomerInfo(user.email).catch((err) => {
    //   if (err.code === 400 && err.status === 'Bad Request') return null;
    //   throw err;
    // });
    // if (customer) await zfc.activateDibs(user.email, studio.source_dibscode);
    // if (!customer) {
    //   ({ customer } = await zfc.createUser(user, studio.source_dibscode));
    // }
    // if (userStudio.signed_waiver) await zfc.changeWaiverStatus(user.email, true);
    // userStudio.clientid = customer.id;
    // userStudio.zf_activated = true;
    // await userStudio.save();
    // return userStudio;
  } catch (err) {
    return errorHelper.handleError({
      opsSubject: 'New User Studio Signup Error',
      opsIncludes: `User: ${user.id}, Studio: ${studio.id}`,
    })(err);
  }
};
