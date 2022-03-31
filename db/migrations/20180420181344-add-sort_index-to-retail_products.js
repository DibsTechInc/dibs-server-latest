'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('retail_products', 'sortIndex', {
      type: Sequelize.INTEGER,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('retail_products', 'sortIndex');
  },
};
