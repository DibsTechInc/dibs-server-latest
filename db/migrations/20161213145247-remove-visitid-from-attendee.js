'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('attendees', 'visitid')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('attendees', 'visitid', Sequelize.STRING)
  }
};
