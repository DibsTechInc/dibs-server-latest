module.exports = function associate(models) {
  models.promo_code.hasMany(models.promo_codes_user, {
    foreignKey: 'group_id',
    sourceKey: 'group_id',
    as: 'currentPCUser',
  });
  models.promo_code.hasMany(models.promo_codes_user, {
    foreignKey: 'group_id',
    sourceKey: 'group_id',
    as: 'allPCUsers',
  });
  models.promo_code.belongsToMany(models.dibs_user, {
    through: models.promo_codes_user,
    foreignKey: 'promoid',
    otherKey: 'userid',
    as: 'user',
  });
  models.promo_code.belongsTo(models.dibs_studio, {
    foreignKey: 'dibs_studio_id',
    as: 'studio',
  });
};
