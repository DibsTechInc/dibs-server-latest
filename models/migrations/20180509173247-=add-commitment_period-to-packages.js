'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studio_packages', 'commitment_period', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('studio_packages', 'commitment_period')
  }
};
