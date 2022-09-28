const moment = require('moment');
const MailClient = require('@dibs-tech/mail-client');
const studioSourceSelector = require('./studio-source-selector');

const mc = new MailClient();
/**
 * @callback IncentiveAutomator~Callback
 * @param {Error} err               Error response
 * @param {object} response         Incentive Automator response
 */

/**
 * Gives out flash credits to new users on registration if they have an email in the incentives table.
 * @param  {string}   email    user email to match
 * @param  {number}   userId   dibs_user id from dibs_user table
 * @param  {string}   studioId id representing a studio. Zingfit studios are prefaced with a 'z'
 * @param  {IncentiveAutomator~Callback} cb       Callback to API
 * @return {undefined}
 */
function emailAutomator(email, userId, studioId, cb) {
  if (!studioId) {
    cb(null, { status: false, msg: 'User did not sign up on studio site' });
  // will eventually need a way to handle multi-studio brands
  } else if (studioId.substr(0, 1) === '[') {
    cb(null, { status: false, msg: 'User signed up on a multi-studio widget. This currently does not support incentives.' });
  } else {
    const { studioid: moddedStudioId, source } = studioSourceSelector(studioId);
    models.incentive.find({ where: { email: { $like: email }, studioid: moddedStudioId, source } })
    .then((incentive) => {
      if (!incentive) {
        cb(null, { status: false, msg: 'No user in incentive list' });
      } else if (moment() > moment(incentive.expiration)) {
        cb(null, { status: false, msg: 'Incentive has expired for this user' });
      } else {
        incentive.destroy().then(() =>
          models.flash_credit.create({
            studioid: incentive.studioid,
            userid: userId,
            credit: incentive.credit,
            source: incentive.source,
            expiration: incentive.expiration,
          })
        ).then(() => {
          let queryString;
          if (source === 'zf') {
            queryString = "SELECT name FROM dibs_studios WHERE studioid = $id AND source = 'zf' LIMIT 1";
          } else {
            queryString = "SELECT name FROM dibs_studios WHERE studioid = $id AND source = 'mb' LIMIT 1";
          }

          return models.sequelize.query(queryString, { bind: { id: studioId } });
        }).then((result) => {
          cb(null, {
            status: true,
            msg: `Incentive created for ${email}`,
            amount: incentive.credit,
            studio: result[0][0].name,
          });
        });
      }
    }).catch((err) => {
      console.log(err);
      mc.ops('Incentivator Error', `There was an error with the incentive automator: ${err}`);
      cb(err);
    });
  }
}
/**
 * Gives out flash credits to new users on registration if they have use a promotional code
 * THIS DOES NOT CURRENTLY WORK
 * @param  {string}   code     code to match
 * @param  {number}   userId   dibs_user id from dibs_user table
 * @param  {string}   studioId id representing a studio. Zingfit studios are prefaced with a 'z'
 * @param  {IncentiveAutomator~Callback} cb       Callback to API
 * @return {undefined}
 */
function codeAutomator(code, userId, studioId, cb) {
  if (!studioId) {
    cb(null, { status: false, msg: 'User did not sign up on studio site' });
  } else {
    const { studioid: moddedStudioId, source } = studioSourceSelector(studioId);
    models.incentive.find({ where: { code: { $like: code }, studioid: moddedStudioId, source } })
    .then((incentive) => {
      if (!incentive) {
        cb(null, { status: false, msg: 'No user in incentive list' });
      } else if (moment() > moment(incentive.expiration)) {
        cb(null, { status: false, msg: 'Incentive has expired for this user' });
      } else {
        incentive.destroy().then(() =>
          models.flash_credit.create({
            studioid: incentive.studioid,
            userid: userId,
            credit: incentive.credit,
            source: incentive.source,
            expiration: incentive.expiration,
          })
        ).then(() => {
          let queryString;
          if (source === 'zf') {
            queryString = "SELECT name FROM dibs_studios WHERE studioid = $id AND source = 'zf' LIMIT 1";
          } else {
            queryString = "SELECT name FROM dibs_studios WHERE studioid = $id AND source = 'mb' LIMIT 1";
          }

          return models.sequelize.query(queryString, { bind: { id: studioId } });
        }).then((result) => {
          cb(null, {
            status: true,
            msg: `Incentive created for ${code}`,
            amount: incentive.credit,
            studio: result[0][0].name,
          });
        });
      }
    }).catch((err) => {
      cb(err);
    });
  }
}

module.exports = {
  email: emailAutomator,
  code: codeAutomator,
};
