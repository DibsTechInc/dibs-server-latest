'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('events', ['mbstudioid', 'source'])
      .then(() => queryInterface.addIndex('events', ['zfstudio_id', 'source']))
      .then(() => queryInterface.addIndex('events', ['mbstudioid']))
      .then(() => queryInterface.addIndex('events', ['zfstudio_id']))
      .then(() => queryInterface.addIndex('events', ['source']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('events', ['mbstudioid', 'source'])
      .then(() => queryInterface.removeIndex('events', ['zfstudio_id', 'source']))
      .then(() => queryInterface.removeIndex('events', ['mbstudioid']))
      .then(() => queryInterface.removeIndex('events', ['zfstudio_id']))
      .then(() => queryInterface.removeIndex('events', ['source']))
  }
};
