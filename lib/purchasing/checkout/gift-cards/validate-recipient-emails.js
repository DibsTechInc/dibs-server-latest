const MailClient = require('@dibs-tech/mail-client');
const purchaseErrorLib = require('../../../errors/purchasing');

module.exports = async function validateRecipientEmails(user, cart) {
  if (!cart.giftCards.length) return;
  await Promise.map(
    cart.giftCards,
    async (giftCardItem) => {
      if (
        !giftCardItem.recipientEmail
        || giftCardItem.email === user.email
      ) return;
      const email = giftCardItem.recipientEmail;
      const { success } = await MailClient.validateEmail(email);
      if (!success) {
        throw new purchaseErrorLib.CartError(
          `Gift card recipient email: ${email} is invalid`,
          { invalidRecipientEmail: true }
        );
      }
    }
  );
};
