module.exports = function linkStudioBrands(sequelize, DataTypes) {
  return sequelize.define('studio_brands', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brandid: {
      type: DataTypes.INTEGER,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    source: {
      type: DataTypes.STRING,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    updatedAt: DataTypes.DATE,
  }, {
  });
};
