'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('flash_credits', 'user_category', {
      type: Sequelize.STRING,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('flash_credits', 'user_category');
  }
};
