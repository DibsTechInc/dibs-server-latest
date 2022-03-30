'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('passes', 'onDibs', Sequelize.BOOLEAN)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('passes', 'onDibs')

  }
};
