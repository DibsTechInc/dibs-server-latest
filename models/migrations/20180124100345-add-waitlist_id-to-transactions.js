'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studio_packages', 'validForInterval', {
      type: Sequelize.ENUM,
      values: ['day', 'week', 'month', 'year'],
      allowNull: true,
      defaultValue: 'month',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('studio_packages', 'validForInterval');
  }
};
