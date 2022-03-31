'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_studio_locations', 'retail_tax_rate', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('dibs_studio_locations', 'retail_tax_rate')
  }
};
