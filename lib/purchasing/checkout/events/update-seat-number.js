const Promise = require('bluebird');

module.exports = async function updateSeatNumber(cartTransactions, studio) {
  if (!cartTransactions) {
    return null;
  }

  try {
    return await Promise.each(cartTransactions, async (t) => {
      if (!t.spot_id) {
        return;
      }

      const spot = await models.spot.findOne({
        where: {
          id: t.spot_id,
        },
        attributes: ['source_id'],
      });

      t.source_id = spot.source_id;
      t.spot_label = studio.dibs_config.spot_label;
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
