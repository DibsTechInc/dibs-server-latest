/**
 * linkExchangeRate model
 *
 * @param {Object} sequelize - instance of Sequelize
 * @param {Object} DataTypes - sequelize data types
 *
 * @returns {Object} exchange_rate model
 */
function linkExchangeRate(sequelize, DataTypes) {
  /**
   * exchange_rate model
   *
   * @prop {Number} id primary key
   * @prop {Number} rate the exchange rate
   * @prop {String} from the currency we are exchanging from (i.e. GBP)
   * @prop {String} to the currency we are exchanging to (i.e. USD)
   * @prop {Date} createdAt
   * @prop {Date} updatedAt
   */
  return sequelize.define('exchange_rate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rate: DataTypes.FLOAT,
    from: DataTypes.STRING(3),
    to: DataTypes.STRING(3),
    createdAt: DataTypes.DATE,
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {});
}

module.exports = linkExchangeRate;
