'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('attendees', ['studioID', 'classID'], {unique: false});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('attendees', ['studioID', 'classID']);
  }
};
