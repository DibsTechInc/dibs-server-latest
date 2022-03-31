module.exports = function linkPriceBand(sequelize, DataTypes) {
  /**
   * price_brands
   * @prop {number} dibs_portal_userid primary key
   * @prop {number} dibs_brand_id primary key
   */
  const PriceBand = sequelize.define('price_band', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_studio_id: DataTypes.INTEGER,
    class_name: DataTypes.STRING,
    mean: DataTypes.INTEGER,
    fill_rate: DataTypes.FLOAT,
    band_number: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  PriceBand.associate = function associate(models) {
    models.price_band.belongsTo(models.dibs_studio, { as: 'studio', foreignKey: 'dibs_studio_id' });
  };

  return PriceBand;
};
