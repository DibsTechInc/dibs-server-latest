'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('attendees', 'checkedin', { type: Sequelize.BOOLEAN, defaultValue: false })
  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('attendees', 'checkedin')
  }
};
