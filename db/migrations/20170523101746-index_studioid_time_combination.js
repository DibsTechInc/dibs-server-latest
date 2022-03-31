'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('events', ['mbstudioid', 'start_date']).then(() =>
    queryInterface.addIndex('events', ['zfstudio_id', 'start_date']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('events', ['mbstudioid', 'start_date']).then(() =>
    queryInterface.removeIndex('events', ['zfstudio_id', 'start_date']))
  }
};
