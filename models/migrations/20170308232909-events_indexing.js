'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('events', ['start_date', 'source', 'mbstudioid'])
      .then(() => queryInterface.addIndex('events', ['start_date', 'source', 'zfstudio_id']))

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('events', ['start_date', 'source', 'mbstudioid'])
      .then(() => queryInterface.removeIndex('events', ['start_date', 'source', 'zfstudio_id']))
  }
};
