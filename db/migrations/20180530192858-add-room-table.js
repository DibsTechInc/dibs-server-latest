'use strict';
const defaultColumns = require('./helpers/defaultColumns');

const roomSchema = (DataTypes) => ({
  ...defaultColumns(DataTypes),
  name: DataTypes.STRING,
  dibs_studio_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'dibs_studios',
      as: 'studio',
      key: 'id',
    }
  },
  source_roomid: DataTypes.BIGINT,
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'dibs_studio_locations',
      as: 'location',
      key: 'id',
    }
  }
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rooms', roomSchema(Sequelize));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rooms');
  },
};
