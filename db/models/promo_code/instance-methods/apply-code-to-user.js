/**
 * @param {Number} userid user to apply code to
 * @param {SequelizeTransaction} transaction optional sql transaction
 * @returns {Promise<Object>} new promo_codes_user
 */
module.exports = function applyCodeToUser(userid, transaction = null) {
  return models.promo_codes_user.create({
    userid,
    promoid: this.id,
    source: this.source,
    studioid: this.studioid,
    dibs_studio_id: this.dibs_studio_id,
    group_id: this.group_id,
  }, transaction ? { transaction } : undefined);
};
