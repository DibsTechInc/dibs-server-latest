const defaultOptions = {
  href: false,
};

/**
 * getPhoneNumberFromCurrency - Gets Dibs phone number based on studio currency
 * for templated emails
 *
 * @param {string}  currency - studio currency code
 * @param {object}  argOptions - optional options object
 * @param {boolean} argOptions.href - determines if formatting for HTML or
 *
 * @returns {string} phone number
 */
function getPhoneNumberFromCurrency(currency, argOptions = defaultOptions) {
  const options = argOptions;
  Object.keys(defaultOptions).forEach((option) => {
    if (options[option] === undefined) options[option] = defaultOptions[option];
  });
  switch (currency) {
    case 'GBP':
      return options.href ? 'tel:44-20-3389-8689' : '+44 20 3389 8689';
    case 'USD':
    default:
      return options.href ? 'tel:646-760-3427' : '(646)-760-3427';
  }
}

module.exports = getPhoneNumberFromCurrency;
