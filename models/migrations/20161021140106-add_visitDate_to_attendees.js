'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('attendees', 'visitDate', Sequelize.DATE)
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('attendees', 'visitDate')
  }
};
