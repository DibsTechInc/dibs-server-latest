const Decimal = require('decimal.js');
const MailClient = require('@dibs-tech/mail-client');
const retailPromo = require('./promo-code');
const stripeLib = require('../shared/stripe');
const { RetailError } = require('../../errors/purchasing/types');
const creditHelper = require('../shared/apply-credit');
const errorHelper = require('../../errors/');
const { PromoCodeAssociationError } = require('../../errors/purchasing/types');
const { StripeChargeError } = require('../../errors/stripe/types.js');
const stripeErrorLib = require('../../errors/stripe');

const mc = new MailClient();
/**
 *
 * @param {Error} err  error object
 * @param {object} options optional parameters
 * @param {object} options.employee instance of employee
 * @param {object} options.studio instance of studio
 * @param {object} options.user instance of user
 * @param {object} options.itemid item identifier
 * @returns {function} error handler
 */
async function handleRetailError(err, { employee = {}, studio = {}, user = {}, itemid = null } = {}) {
  switch (err.constructor) {
    case StripeChargeError:
      return stripeErrorLib.handleStripeError({ source: stripeErrorLib.StripeErrorSources.RetailPurchase, user, err, studio, returnResponse: true });
    case PromoCodeAssociationError:
      return errorHelper.handleError({
        opsSubject: 'Retail - Promo Code Error',
        employeeid: employee.id,
        userid: user.id,
        opsIncludes: `Item ${itemid}`,
        returnResponse: true,
        resMessage: err.message,
      })(err);
    default:
      return errorHelper.handleError({
        opsSubject: 'Retail Error',
        employeeid: employee.id,
        userid: user.id,
        opsIncludes: `Item ${itemid}`,
        returnResponse: true,
        resMessage: 'Oops! Something went wrong trying to purchase this item',
      })(err);
  }
}
/**
 *
 * @param {Object} user  instance of the user (should include credits)
 * @param {number} itemid  identifier of product for sale
 * @param {Object} options additional parameters
 * @param {number} options.locationid non-default location id of studio
 * @param {string} options.code promo code string
 * @param {object} options.employee instance of employee making purchase
 * @returns {Promise} success/failure response
 */
module.exports = async function purchaseRetailProduct(user, itemid, { locationid = null, code = '', employee = {} } = {}) {
  try {
    const product = await models.retail_product.findById(itemid, {
      include: [{
        model: models.dibs_studio,
        as: 'studio',
      }],
    });
    const studio = product.studio;

    const location = await models.dibs_studio_locations.findById(locationid || studio.primary_locationid);
    const promoCode = await retailPromo.handle(studio, code, user);
    const dibsTransaction = await models.dibs_transaction.newRetailTransaction({
      user,
      studio,
      product,
      promoCode,
      location,
      description: `Beginning purchase of retail item ${product.name}`,
      employeeid: employee.id,
    });
    await models.sequelize.transaction(async (sqlTransaction) => {
      await creditHelper.applyStudioCreditToTransaction(user, dibsTransaction, sqlTransaction);
      await creditHelper.applyRafCreditToTransaction(user, dibsTransaction, sqlTransaction);
      dibsTransaction.calculateTaxWithheld(+Decimal(product.taxable ? location.retail_tax_rate : 0).dividedBy(100));

      if (dibsTransaction.chargeAmount >= 0.5) {
        dibsTransaction.setStripeFee(await stripeLib.calculateStripeFee(user, dibsTransaction.chargeAmount, studio.currency));
        dibsTransaction.calculateStudioPayment();
        const charge = await stripeLib.charge({
          dibsTransaction,
          user,
          studio,
          description: `${studio.name} - Retail`,
        });
        dibsTransaction.setStripeChargeId(charge.id);
      }

      if (dibsTransaction.chargeAmount && dibsTransaction.chargeAmount < 0.5) await stripeLib.handleTransactionMinChargeAdjustment(dibsTransaction, { sendEmail: false });

      return dibsTransaction.success({ save: true, transaction: sqlTransaction });
    }).catch(async (err) => {
      if (dibsTransaction.stripe_charge_id) await stripeLib.refund(dibsTransaction.stripe_charge_id, Boolean(studio.stripe_account_id), err);
      // TODO eventually add integration tests and move this save to beginning
      dibsTransaction.save();
      if (err.constructor === StripeChargeError) {
        throw err;
      }
      throw new RetailError(err);
    });
    mc.transactions('Retail Purchase', `Purchase of retail item ${JSON.stringify(product, null, 2)} \n\n Transaction ${JSON.stringify(dibsTransaction, null, 2)}`);
    return apiSuccessWrapper({ dibsTransaction, product }, `Successfully purchased ${product.name}`);
  } catch (err) {
    return handleRetailError(err, { user, employee, itemid });
  }
};
