'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('credits', 'currency', Sequelize.STRING(3))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('credits', 'currency')
  }
};
