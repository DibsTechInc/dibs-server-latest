module.exports = function linkRetailProduct(sequelize, DataTypes) {
  const RetailProduct = sequelize.define('retail_product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    taxable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    display_on_roster: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now'),
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    sortIndex: DataTypes.INTEGER,
  }, {
    paranoid: true,
  });
  RetailProduct.associate = function associate(models) {
    RetailProduct.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      as: 'studio',
    });
  };
  return RetailProduct;
};
