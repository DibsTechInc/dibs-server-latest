'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('events', ['mbstudioid', 'source', 'mblocationid'])
      .then(() => queryInterface.addIndex('events', ['zfstudio_id', 'source', 'zfsite_id']))

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('events', ['mbstudioid', 'source', 'mblocationid'])
          .then(() => queryInterface.removeIndex('events', ['zfstudio_id', 'source', 'zfsite_id']))
  }
};
