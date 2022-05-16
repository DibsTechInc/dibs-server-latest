/**
 * @param {number} passid of pass to get package name for
 * @param {Object} transactions booked with that pass
 * @returns {string} pack name associated to package id
 */
module.exports = async function getPackNameFromPassid(passid, transactions) {
  if (transactions.length) return transactions[0].pass.studioPackage.name;
  const pass = await models.passes.findById(passid, {
    attributes: [],
    include: [{
      model: models.studio_packages,
      as: 'studioPackage',
      attributes: ['name'],
    }],
  });
  return pass.studioPackage.name;
};
