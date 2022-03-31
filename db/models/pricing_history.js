module.exports = function linkPricingHistory(sequelize, DataTypes) {
  /**
   * pricing_history
   *
   * @class membership_subscription
   */
  return sequelize.define('pricing_history', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'events',
        key: 'eventid',
      },
    },
    currentPrice: DataTypes.INTEGER,
    spots_booked: DataTypes.INTEGER,
    seats: DataTypes.INTEGER,
    lastVisible: DataTypes.DATE,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    updatedAt: DataTypes.DATE,
  }, {
    // paranoid: true,
    freezeTableName: true,
    indexes: [{
      fields: ['eventid', 'currentPrice', 'spots_booked'],
    }],
  });
};
