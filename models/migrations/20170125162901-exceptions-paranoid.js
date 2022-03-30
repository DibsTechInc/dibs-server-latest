'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('exceptions', 'deletedAt', {
      type: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('exceptions', 'deletedAt');
  }
};
