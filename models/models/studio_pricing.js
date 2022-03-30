module.exports = function linkStudioPricing(sequelize, DataTypes) {
  /**
   * studio_pricing
   * @class studio_pricing
   * @prop {number} id the id
   * @prop {string} source the source
   * @prop {number} studioid the studio id
   * @prop {number} locationid the location id
   * @prop {number} min_price the minimum price
   * @prop {number} max_price the maximum price
   * @prop {boolean} cp_problem whether there's a classpass problem
   * @prop {number} seat_buffer the seat_buffer amount
   * @prop {DateTime} createdAt the date created
   * @prop {DateTime} updatedAt the last time updated
   */
  return sequelize.define('studio_pricing', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source: {
      type: DataTypes.STRING(4),
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    min_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    max_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    cp_problem: {
      type: DataTypes.BOOLEAN,
    },
    seat_buffer: {
      type: DataTypes.INTEGER,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
  });
};
