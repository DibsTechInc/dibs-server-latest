/**
 * @param {string} pronoun one of 'you', 'your', 'yourself'
 * @param {string} user user
 * @param {string} employeeid employeeid if employee
 * @returns {string} returns pronoun
 */
function getPronounForErrorMsg(pronoun, user, employeeid = null) {
  switch (pronoun) {
    case 'you':
      return employeeid ? user.firstName : 'you';
    case 'your':
      return employeeid ? user.firstName.concat('\'s') : 'your';
    case 'yourself':
      return employeeid ? user.firstName : 'yourself';
    default:
      return user.firstName;
  }
}

module.exports = {
  getPronounForErrorMsg,
};
