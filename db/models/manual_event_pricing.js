module.exports = function linkManualEventPricing(sequelize, DataTypes) {
  const ManualPricing = sequelize.define('manual_event_pricing', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventid: DataTypes.INTEGER,
    prices: DataTypes.JSON,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
  });
  ManualPricing.associate = function associate(models) {
    models.manual_event_pricing.belongsTo(models.event, { foreignKey: 'eventid', targetKey: 'eventid', as: 'event' });
  };
  return ManualPricing;
};
