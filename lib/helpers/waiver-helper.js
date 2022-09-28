const MBClient = require('@dibs-tech/mindbody-client');
const ZFClient = require('@dibs-tech/zingfit-client');

module.exports = async function signUserWaiver(user, userStudio, studio) {
  if (userStudio.source === 'mb') {
    const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, userStudio.studioid);
    await Promise.promisify(mbc.changeWaiverStatus, { context: mbc })(userStudio.clientid, true);
  }
  // if (userStudio.source === 'zf') {
  //   const zfc = new ZFClient(studio.client_id, studio.client_secret, studio.dibs_config.default_region);
  //   await zfc.changeWaiverStatus(user.email, true);
  // }
};
