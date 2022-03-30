'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('events', 'has_waitlist', Sequelize.BOOLEAN)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('events', 'has_waitlist')
  }
};
