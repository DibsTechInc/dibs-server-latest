'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('events', 'room_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'rooms',
        key: 'id',
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('events', 'room_id');
  }
};
