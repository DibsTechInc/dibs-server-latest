module.exports = function linkRevenueReference(sequelize, DataTypes) {
  /**
   * revenue_reference
   * @class revenue_reference
   * @prop {number} studioID the studio id
   * @prop {string} paymentCategory the payment categroy
   * @prop {string} DibsCategory1 the dibs category, 1
   * @prop {string} DibsCategory2 the dibs catefory 2
   * @prop {number} avgRevenue the avg revenue amount
   * @prop {number} serviceID the service id
   */
  return sequelize.define('revenue_reference', {
    studioID: DataTypes.INTEGER,
    paymentCategory: DataTypes.STRING,
    DibsCategory1: DataTypes.STRING,
    DibsCategory2: DataTypes.STRING,
    avgRevenue: DataTypes.FLOAT,
    serviceID: DataTypes.BIGINT,
  }, {
    tableName: 'revenue_reference',
  });
};
