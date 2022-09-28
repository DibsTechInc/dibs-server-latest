const moment = require('moment');
const Decimal = require('decimal.js');
const Promise = require('bluebird');
const models = require('../../models/sequelize');
const errorLib = require('../errors');

/**
 * @param {Object} pass instance which expired
 * @param {Object} sqlTransaction SQL transaction
 * @returns {Promise<undefined>} awards user credit
 */
async function awardCreditForExpiredPass(pass, sqlTransaction) {
  const [credit, created] = await models.credit.findOrInitialize({
    where: {
      userid: pass.userid,
      dibs_studio_id: pass.dibs_studio_id,
    },
    defaults: {
      source: pass.source,
      studioid: pass.studioid,
    },
  });
  credit.credit = created ? pass.passValue : +Decimal(credit.credit).plus(pass.passValue);
  await credit.save({ transaction: sqlTransaction });
}

/**
 * This function handles transactions picked up by the cron for users who did
 * not get off the waitlist for a class. It gives users who used a pass on
 * Dibs their pass use back. If the pass expired and its not unlimited, it awards
 * the amount of the pass value back in credit
 *
 * @param {Array<Object>} waitlistTransactions for users who did not get off the waitlist
 * @returns {Promise<undefined>} handles transactions where the user did not get off the waitlist
 */
module.exports = async function handleUnsuccessfulWaitlistTransaction(waitlistTransactions) {
  return Promise.map(waitlistTransactions, async (waitlistTransaction) => {
    try {
      await models.sequelize.transaction(async (sqlTransaction) => {
        waitlistTransaction.amendDescription('User unable to get off waitlist');
        const destroyTransaction = waitlistTransaction.destroy({ transaction: sqlTransaction });
        // no pass on the transaction or was offsite
        if (!waitlistTransaction.pass || waitlistTransaction.pass.source_serviceid) {
          return await destroyTransaction;
        }
        // pass was used but its expired and not unlimited
        if (
          moment(waitlistTransaction.pass.expiresAt).isBefore(moment())
          && !waitlistTransaction.pass.studioPackage.unlimited
        ) {
          await awardCreditForExpiredPass(waitlistTransaction.pass, sqlTransaction);
          return await destroyTransaction;
        }
        // pass was used
        await waitlistTransaction.pass.returnUses(1, { save: true, transaction: sqlTransaction });
        return await destroyTransaction;
      });
    } catch (err) {
      errorLib.handleError({
        opsSubject: 'Waitlist Error',
        opsBody: 'Something went wrong handling when a user did not get off the waitlist',
        opsIncludes: `Waitlist transaction ${waitlistTransaction.id}`,
        userid: waitlistTransaction.userid,
      })(err);
    }
  });
};
