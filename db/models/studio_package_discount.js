module.exports = function linkStudioPackageDiscount(sequelize, DataTypes) {
  const StudioPackageDiscount = sequelize.define('studio_package_discount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    promotion_name: DataTypes.STRING,
    discount_price: DataTypes.FLOAT,
    discount_price_autopay: DataTypes.FLOAT,
    studio_package_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'studio_packages',
        key: 'id',
      },
    },
    promotion_start: {
      type: DataTypes.DATE,
    },
    promotion_end: {
      type: DataTypes.DATE,
    },
  });
  return StudioPackageDiscount;
};
