'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('attendees', ['visitDate', 'source', 'dropped', 'studioID'])
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('attendees', ['visitDate', 'source', 'dropped', 'studioID'])
  }
};
