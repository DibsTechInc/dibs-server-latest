const crypto = require('crypto');
/**
 * Generates a random base64 string of specified length.
 * @param  {number} length  length of string to generate
 * @return {string}        random Base64 string (url safe)
 */
function base64PW(length) {
  return crypto.randomBytes(Math.ceil((length * 3) / 4))
  .toString('base64')
  .slice(0, length)
  .replace(/[+\\]/g, Math.floor(Math.random() * 10));
}

module.exports = { base64PW };
