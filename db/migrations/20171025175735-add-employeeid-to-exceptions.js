'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('exceptions', 'employeeid', {
      type: Sequelize.INTEGER,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('exceptions', 'employeeid');
  }
};
