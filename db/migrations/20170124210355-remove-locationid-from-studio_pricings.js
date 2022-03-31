'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_pricings', 'locationid');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_pricings', 'locationid', Sequelize.INTEGER);
  }
};
