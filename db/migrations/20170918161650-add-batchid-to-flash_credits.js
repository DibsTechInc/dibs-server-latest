'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('flash_credits', 'batchid', {
      type: Sequelize.INTEGER,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('flash_credits', 'batchid');
  }
};
