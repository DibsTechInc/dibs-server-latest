module.exports = function linkCustomEventsAttribute(sequelize, DataTypes) {
  const CustomEventsAttribute = sequelize.define('custom_events_attribute', {
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
    event_name: DataTypes.STRING,
    notice_message: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now'),
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
  });
  return CustomEventsAttribute;
};
