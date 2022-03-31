module.exports = function linkMBService(sequelize, DataTypes) {
  /**
   * mb_service
   *
   * @class mb_service
   * @prop {number} mbserviceid
   * @prop {number} mbprogramid
   * @prop {number} mbstudioid
   * @prop {string} name
   * @prop {string} dibscategory2
   * @prop {number} price
   * @prop {number} online_price
   * @prop {number} avg_revenue
   * @prop {datetime} createdAt
   * @prop {datetime} updatedAt
   */
  return sequelize.define('mb_service', {
    mbserviceid: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
    },
    mbprogramid: DataTypes.INTEGER,
    mbstudioid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    name: DataTypes.STRING,
    dibscategory2: DataTypes.STRING(5),
    price: DataTypes.FLOAT,
    online_price: DataTypes.FLOAT,
    avg_revenue: DataTypes.FLOAT,
    createdAt: DataTypes.DATE,
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
  });
};
