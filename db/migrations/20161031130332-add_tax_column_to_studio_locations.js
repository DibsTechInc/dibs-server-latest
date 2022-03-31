'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('mb_locations', 'tax_rate', Sequelize.FLOAT).then(() =>
      queryInterface.addColumn('zf_sites', 'tax_rate', Sequelize.FLOAT)
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('mb_locations', 'tax_rate').then(() =>
      queryInterface.removeColumn('zf_sites', 'tax_rate')
    )
  }
};
