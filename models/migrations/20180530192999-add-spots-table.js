'use strict';
const defaultColumns = require('./helpers/defaultColumns');

const SpotTypes = {
  BOOKABLE: 'BOOKABLE',
  EQUIPMENT: 'EQUIPMENT',
  INSTRUCTOR: 'INSTRUCTOR',
  BROKEN: 'BROKEN',
  UNUSED: 'UNUSED',
}

const spotSchema = (DataTypes) => ({
  ...defaultColumns(DataTypes),
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
      model: 'rooms',
    },
    onDelete: 'CASCADE'
  }
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('spots', spotSchema(Sequelize));
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('spots'),
      queryInterface.sequelize.query('DROP TYPE public.enum_spots_type;')
    ])
  },
};