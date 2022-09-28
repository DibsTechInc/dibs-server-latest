const models = require('../../../models/sequelize');
const { userIncludeConfig } = require('../../../config/passport/include-config');
const applyCreditLib = require('../shared/apply-credit');
const stripeLib = require('../shared/stripe');
const Decimal = require('decimal.js');
const purchaseErrorLib = require('../../errors/purchasing');
const bookingEmailLib = require('../../emails/booking');
const waitlistEmailLib = require('../../emails/waitlist');
const { EmailTypes } = require('@dibs-tech/mail-client');

module.exports = {
  async chargeForWaitlist(waitlistTransaction) {
    let charge;
    let charged = false;
    try {
      const user = await models.dibs_user.findById(waitlistTransaction.userid, {
        include: userIncludeConfig(models),
      });

      let dibsTransaction = await models.dibs_transaction.newClassTransactionFromWaitlist(waitlistTransaction, { save: true });
      await waitlistTransaction.destroy();

      if (waitlistTransaction.pass && waitlistTransaction.pass.source_serviceid) {
        await user.syncOffsitePasses(waitlistTransaction.studioid, waitlistTransaction.source);
      }
      if (waitlistTransaction.pass) {
        await dibsTransaction.success({ save: true });
        bookingEmailLib.sendBookingConfirmationEmail(user, [dibsTransaction], EmailTypes.WAITLIST_CONFIRMATION);
        waitlistEmailLib.sendTransactionsEmail(dibsTransaction.id);
        if (waitlistTransaction.pass.studioPackage.expires_after_first_booking) {
          waitlistTransaction.pass = await waitlistTransaction.pass.setExpirationFromEvent({
            event: waitlistTransaction.event,
            dibsTransactionId: dibsTransaction.id,
            save: true,
          });
        }
        return;
      }

      await models.sequelize.transaction(async (sqlTransaction) => {
        dibsTransaction = await applyCreditLib.applyStudioCreditToTransaction(user, dibsTransaction, sqlTransaction);
        dibsTransaction = await applyCreditLib.applyRafCreditToTransaction(user, dibsTransaction, sqlTransaction);
        dibsTransaction.calculateTaxWithheld(+Decimal(waitlistTransaction.event.location.tax_rate).dividedBy(100));
        dibsTransaction.calculateDibsFee(waitlistTransaction.dibs_studio);

        if (dibsTransaction.chargeAmount >= 0.5) {
          dibsTransaction.setStripeFee(await stripeLib.calculateStripeFee(user, dibsTransaction.chargeAmount, waitlistTransaction.dibs_studio.currency));
          dibsTransaction.calculateStudioPayment();
          charge = await stripeLib.charge({
            dibsTransaction,
            user,
            studio: waitlistTransaction.dibs_studio,
            description: `${waitlistTransaction.dibs_studio.name} - Class Booking - Dibs`,
          });
          charged = true;
          dibsTransaction.setStripeChargeId(charge.id);
        }
        if (dibsTransaction.chargeAmount && dibsTransaction.chargeAmount < 0.5) await stripeLib.handleTransactionMinChargeAdjustment(dibsTransaction, { sendEmail: false });
        return dibsTransaction.success({ save: true, transaction: sqlTransaction });
      });
      bookingEmailLib.sendBookingConfirmationEmail(user, [dibsTransaction], EmailTypes.WAITLIST_CONFIRMATION);
      waitlistEmailLib.sendTransactionsEmail(dibsTransaction.id);
    } catch (err) {
      if (charged) await stripeLib.refund(charge.id, Boolean(waitlistTransaction.dibs_studio.stripe_account_id), err);
      purchaseErrorLib.handlePurchaseError({ waitlistTransaction, err: new purchaseErrorLib.WaitlistChargeError(err) });
    }
  },
};
