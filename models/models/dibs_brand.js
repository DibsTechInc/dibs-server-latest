const DIBS_BRAND_TIERS = {
  RECEIPT: 'receipt',
  STUDIO: 'studio',
  PASS: 'pass',
};

const DIBS_BRAND_CATEGORIES = {
  STUDIO: 'studio',
  COFFEE: 'coffee',
  JUICE: 'juice',
  FOOD: 'food',
  SELFCARE: 'selfcare',
};

module.exports = function linkDibsBrand(sequelize, DataTypes) {
  /**
   * dibs_brand
   * @prop {number} id primary key
   * @prop {string} email prelaunch user email
   * @prop {string} city prelaunch user city
   */
  return sequelize.define('dibs_brand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    img_url: {
      type: DataTypes.STRING,
    },
    large_img_url: {
      type: DataTypes.STRING,
    },
    brand_tier: {
      type: DataTypes.ENUM,
      values: Object.values(DIBS_BRAND_TIERS),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM,
      values: Object.values(DIBS_BRAND_CATEGORIES),
      allowNull: false,
    },
    sort_index: {
      type: DataTypes.INTEGER,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
  });
};
