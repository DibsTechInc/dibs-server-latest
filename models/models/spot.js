const SpotTypes = {
  BOOKABLE: 'BOOKABLE',
  EQUIPMENT: 'EQUIPMENT',
  INSTRUCTOR: 'INSTRUCTOR',
  BROKEN: 'BROKEN',
  UNUSED: 'UNUSED',
};

module.exports = function linkSpotTable(sequelize, DataTypes) {
  const Spot = sequelize.define('spot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: Object.keys(SpotTypes),
      allowNull: false,
      defaultValue: SpotTypes['BOOKABLE'],
    },
    source_id: DataTypes.BIGINT,
    bookable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'room',
      },
      onDelete: 'CASCADE',
    },
    spot_label: DataTypes.INTEGER,
    user: {
      type: DataTypes.VIRTUAL(DataTypes.JSONB),
    },
    available: {
      type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
      defaultValue: true,
    },
    top_position: DataTypes.FLOAT,
    left_position: DataTypes.FLOAT,
  });
  Spot.associate = function associate(models) {
    Spot.hasMany(models.dibs_transaction, { foreignKey: 'spot_id' });
    Spot.hasMany(models.attendees, { foreignKey: 'spot_id' });
  };
  return Spot;
};
