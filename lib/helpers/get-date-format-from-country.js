module.exports = function getDateFormatFromCountry(countryCode) {
  return countryCode === 'US' ? 'M/D/YY' : 'D/M/YY';
};
