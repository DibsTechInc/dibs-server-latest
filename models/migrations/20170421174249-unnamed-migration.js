'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('mb_locations', 'short_name', Sequelize.TEXT);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('mb_locations', 'short_name');
  }
};
