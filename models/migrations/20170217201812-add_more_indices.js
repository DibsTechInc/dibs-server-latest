'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('dibs_transactions', ['deletedAt'])
    .then(() => queryInterface.addIndex('attendees', ['visitDate']))
    .then(() => queryInterface.addIndex('attendees', ['studioID', 'source']))
    .then(() => queryInterface.addIndex('events', ['mbstudioid', 'mbclassid', 'source']))
    .then(() => queryInterface.addIndex('events', ['zfstudio_id', 'zfclass_id', 'source']))
    .then(() => queryInterface.addIndex('attendees', ['studioID']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('dibs_transactions', ['deletedAt'])
    .then(() => queryInterface.removeIndex('attendees', ['visitDate']))
    .then(() => queryInterface.removeIndex('attendees', ['studioID', 'source']))
    .then(() => queryInterface.removeIndex('events', ['mbstudioid', 'mbclassid', 'source']))
    .then(() => queryInterface.removeIndex('events', ['zfstudio_id', 'zfclass_id', 'source']))
    .then(() => queryInterface.removeIndex('attendees', ['studioID']));
  }
};
