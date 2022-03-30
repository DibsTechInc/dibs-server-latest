'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_invoices', 'brand_source', {
      type: Sequelize.STRING(4),
      allowNull: true,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_invoices', 'brand_source');
  }
};
