'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('attendees', 'revenue', Sequelize.FLOAT)
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('attendees', 'revenue')
  }
};
