// "Oops. Something went wrong. Please re-attempt or call 646.760.3427.")
/* eslint-disable no-shadow */
const chalk = require('chalk');
const MBClient = require('@dibs-tech/mindbody-client');
const Promise = require('bluebird');

/**
 * @callback ClientBuilder~Callback
 * @param {Error|object} err Error response
 * @param {number|string} clientID Associated client ID or auth token for the user
 */

/**
* Purchase Error Log
* Allows for logging of errors in environments other than test
* @param {string} type - Type of error
* @param {string} err - Error message
* @return {undefined}
* @function
* @private
*/
function purchaseErrLogger(type, err) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(chalk.red(type));
    console.log(chalk.red(err.stack));
  }
}
/**
 * Creates a join table association for a MindBody studio and a dibs_user with requisite
 * client ID. This will either create the MB Account for the user or find an existing one.
 * @param  {object}   user     user object
 * @param  {number}   studioId mindbody studio id
 * @param  {number}   dibsStudioId Dibs studio id
 * @param  {ClientBuilder~Callback} cb callback
 * @return {undefined}
*/
function mbPrepareClient(user, studioId, dibsStudioId, cb) {
  const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, studioId);

  mbc.getSingleClient(user.email, (err, result) => {
    if (err) {
      console.log(err);
      purchaseErrLogger('MB Error', err);
      // mc.ops('MindBody Error', `Failure creating Client ID for User ID:${user.id} Error:${err.stack}`);
      cb(err);
    } else if (!result.GetClientsResult.Clients) {
      mbc.addUserToStudio(user, { SendEmail: false }, (err, result) => {
        if (err) {
          purchaseErrLogger('MB Error', err);
          // mc.ops('MindBody Error', `Failure creating Client ID for User ID:${user.id} Error:${err.stack}`);
          cb(err);
        } else {
          models.dibs_user_studio.findOrInitialize({
            where: {
              userid: user.id,
              studioid: studioId,
              source: 'mb',
              dibs_studio_id: dibsStudioId,
            },
          })
          .then(([userStudio]) => {
            userStudio.clientid = result.AddOrUpdateClientsResult.Clients.Client[0].ID;
            return userStudio.save();
          })
          .then((userStudio) => {
            try {
              cb(null, userStudio.clientid);
            } catch (err) {
              err.clientid = userStudio.clientid;
              throw err;
            }
          })
          .catch((err) => {
            console.log(err);
            cb({ error: 'Database Error' });
            // mc.ops('Database Error', `Failure in overwriting Client ID to User/Studio Join Table, User ID: ${user.id}, Studio ID: ${studioId}, Client ID: ${err.clientid}, Error: ${err.stack}`);
            purchaseErrLogger('DB Error', err);
          });
        }
      });
    } else {
      models.dibs_user_studio.findOrInitialize({
        where: {
          userid: user.id,
          studioid: studioId,
          source: 'mb',
          dibs_studio_id: dibsStudioId,
        },
      })
      .then(([userStudio]) => {
        userStudio.clientid = result.GetClientsResult.Clients.Client[0].ID;
        return userStudio.save();
      })
      .then((userStudio) => {
        cb(null, userStudio.clientid);
      })
      .catch((err) => {
        cb(err);
        purchaseErrLogger('DB Error', err);
        // mc.ops('Database Error', `Failure in saving Client ID to User/Studio Join Table, User ID: ${user.id}, Studio ID: ${studioId}, Client ID: ${result.GetClientsResult.Clients.Client[0].ID}, Error: ${err.stack}`);
      });
    }
  });
}

/**
 * Creates a join table association for a MindBody studio and a dibs_user with requisite
 * client ID. This will either create the ZF Account for the user or find an existing one.
 * This will also add the user to the Dibs group for the studio allowing us to book on their behalf.
 * @param  {object}   user     user object
 * @param  {ZFClient}   zfc    instance of ZFClient for this studio
 * @param  {string}   dibsCode group activation code
 * @param  {Function} cb       [description]
 * @return {undefined}
 */
function zfPrepareClient(user, zfc, dibsCode, cb) {
  const getUserTokenAsync = Promise.promisify(zfc.getUserToken);
  return getUserTokenAsync.call(zfc, user.email)
  .catch((err) => {
    if (err.code === 400) {
      return Promise.promisify(zfc.createUser).call(zfc, user, dibsCode)
      .then(() =>
        getUserTokenAsync.call(zfc, user.email)
      );
    }
    throw err;
  })
  .then(({ access_token: token }) =>
    Promise.promisify(zfc.activateDibs).call(zfc, token, dibsCode).then(() => {
      cb(null, token);
    })
  )
  .catch(err => cb(err));
}
/**
 * Prepare's a client for Pike13
 * @param  {object} user     User object
 * @param  {number} studioid studio id
 * @param  {Pike13ClientInstance} ptc      instance of the Pike13Client
 * @return {Promise}          resolved promise with clientid
 */
function ptPrepareClient(user, { studioid, dibs_studio_id }, ptc) {
  return ptc.getClient(user.email).then((response) => {
    if (response.results.length < 1) {
      return Promise.all([ptc.createClient(user), true]);
    }
    return Promise.all([response.results[0].person, false]);
  }).then(([userData, created]) => {
    const clientid = created ? userData.people[0].id : userData.id;

    return models.dibs_user_studio.create({
      userid: user.id,
      studioid,
      source: 'pt',
      clientid,
      dibs_studio_id,
    });
  }
  ).then(userStudio => userStudio.clientid);
}

module.exports = {
  mbPrepareClient,
  zfPrepareClient,
  ptPrepareClient,
};
