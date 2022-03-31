'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('attendees', ['clientID'], { unique: false });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('attendees', ['clientID']);
  }
};
