module.exports = function niceCardError(errorCode) {
  switch (errorCode) {
    case 'incorrect_cvc':
      return 'Eek! Looks like the wrong security code was entered. Please double check your card and try again.';
    case 'expired_card':
      return 'Oh no! Looks like this card has expired. Please pick a new one and try again.';
    case 'incorrect_number':
      return 'Eek! Looks like an invalid number was entered. Please double check your card number and try again.';
    case 'card_declined':
      return 'Oh no! Your card was declined. Please use another card or contact your bank regarding use of this card.';
    case 'processing_error':
    default:
      return 'Please double check your credit card information. Get in touch if you need help - info@ondibs.com.';
  }
};
