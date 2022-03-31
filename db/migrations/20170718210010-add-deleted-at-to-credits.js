'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('credits', 'deletedAt', Sequelize.DATE);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('credits', 'deletedAt');
  }
};
