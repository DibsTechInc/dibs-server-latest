/**
 * Counts the number of spots, if there is a ZF Formatted spots array.
 * Will return the number of booked spots, or the default value to return
 * @param  {array|null} spotsArray       An array of objects representing ZF Spots
 * @param  {number} defaultValue=0 the default value to return if spotsArray is null
 * @return {number}                  Number of booked spots or default value
 */
module.exports = {
  count(spotsArray, defaultValue = 0) {
    if (!spotsArray) {
      console.error('No spotsArray or spotsArray.spots');
      return defaultValue;
    }
    return spotsArray.reduce((prev, curr) => {
      if (curr.status === 'Available') return prev + 0;
      return prev + 1;
    }, 0);
  },
};
