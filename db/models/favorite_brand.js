module.exports = function linkFavoriteBrand(sequelize, DataTypes) {
  /**
   * favorite_brands
   * @prop {number} dibs_portal_userid primary key
   * @prop {number} dibs_brand_id primary key
   */
  const FavoriteBrand = sequelize.define('favorite_brand', {
    dibs_portal_userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    dibs_brand_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    favorited: {
      type: DataTypes.BOOLEAN,
    },
    received_initial_fc: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  FavoriteBrand.associate = function associate(models) {
    models.favorite_brand.belongsTo(models.dibs_portal_user, { as: 'portalUser', foreignKey: 'dibs_portal_userid' });
    models.favorite_brand.belongsTo(models.dibs_brand, { as: 'brand', foreignKey: 'dibs_brand_id' });
  };

  return FavoriteBrand;
};
