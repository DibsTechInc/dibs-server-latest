'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_brands', 'category', {
      type: Sequelize.ENUM('studio', 'coffee', 'juice', 'food', 'selfcare'),
      defaultValue: 'studio',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_brands', 'category')
  }
};
