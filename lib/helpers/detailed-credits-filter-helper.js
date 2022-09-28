const _ = require('lodash');

// we can assume credits are sorted by studioid as they are ordered as such in the original SQL call
// TODO add additional sorting as a redundency if errors occur

/**
 * Filters detailed credits for MyCredits page so that studios with multiple locations have an
 * address of multiple locations and there is only object of credits one per studio
 * @param  {array} credits An array of objects, each object representing credits at a studio
 * @return {array}         Modified array where credits are only displayed one per studio
 */
function detailedCreditFilterHelper(credits) {
 // prevent mutation
  const updatedCredits = Object.assign([], credits);
  // replace all instances where the studio is in there multiple times
  for (let i = 1; i < updatedCredits.length; i += 1) {
    if (updatedCredits[i].source === updatedCredits[i - 1].source && updatedCredits[i].studioid === updatedCredits[i - 1].studioid) {
      updatedCredits[i].address = 'Multiple Locations';
      updatedCredits[i - 1].address = 'Multiple Locations';
    }
  }

  return _.uniqBy(updatedCredits, 'id');
}

module.exports = detailedCreditFilterHelper;
