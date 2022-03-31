'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('attendees', ['email', 'serviceName', 'studioID', 'source'])
    .then(() => queryInterface.addIndex('attendees', ['serviceName', 'studioID']))
    .then(() => queryInterface.addIndex('events', ['zfstudio_id', 'zfclass_id']))
    .then(() => queryInterface.addIndex('revenue_reference', ['paymentCategory', 'studioID']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('attendees', ['email', 'serviceName', 'studioID', 'source'])
    .then(() => queryInterface.removeIndex('attendees', ['serviceName', 'studioID']))
    .then(() => queryInterface.removeIndex('events', ['zfstudio_id', 'zfclass_id']))
    .then(() => queryInterface.removeIndex('revenue_reference', ['paymentCategory', 'studioID']));

  }
};
