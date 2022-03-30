'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('attendees', ['email'], { unique: false });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('attendees', ['email']);
  }
};
