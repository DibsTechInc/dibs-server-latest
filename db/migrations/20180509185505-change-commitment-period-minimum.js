'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('studio_packages', 'commitment_period', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('studio_packages', 'commitment_period', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    })  }
};
