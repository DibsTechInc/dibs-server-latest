'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_brands', 'brand_tier', {
      type: Sequelize.ENUM('receipt', 'studio', 'pass'),
      defaultValue: 'receipt',
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_brands', 'brand_tier')
  },
};
