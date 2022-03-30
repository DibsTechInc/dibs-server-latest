'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('events', ['zfstudio_id', 'source'])
    .then(() => {
      console.log('zfstudio_id, source')
      queryInterface.removeIndex('events', ['mbstudioid', 'source'])
    })
    .then(() => {
      console.log('mbstudioid, source')
      queryInterface.removeIndex('events', ['zfstudio_id', 'zfclass_id'])
    })
    .then(() => {
      console.log('zfstudio_id, zfclass_id')
      queryInterface.removeIndex('attendees', ['visitDate', 'source', 'dropped', 'studioID'])
    })
    .then(() => {
      console.log('visitDate, source', 'dropped', 'studioID')
      queryInterface.removeIndex('attendees', ['studioID', 'serviceID'])
    })
    .then(() => {
      console.log('studioID', 'serviceID')
      queryInterface.removeIndex('attendees', ['serviceName', 'studioID'])
    })
    .then(() => {
      console.log('serviceName', 'studioID')
      queryInterface.removeIndex('attendees', ['studioID', 'source'])
    })
    .then(() => {
      console.log('studioID', 'source')
      queryInterface.removeIndex('data_attendees', ['email', 'visit_date_trunc'])
    })
    .then(() => {
      console.log('email', 'visit_date_trunc')
      queryInterface.removeIndex('data_attendees', ['studioID', 'source', 'locationid', 'classID'])
    })
    .then(() => {
      console.log('studioID, source', 'locationid', 'classID')
      queryInterface.removeIndex('events', ['start_date', 'source', 'mbstudioid'])
    })
    .then(() => {
      console.log('start_date, source', 'mbstudiod')
      queryInterface.removeIndex('events', ['start_date', 'source', 'zfstudio_id'])
    })
    .then(() => {
      console.log('start_date, source', 'zfstudioid')
      queryInterface.removeIndex('events', ['zfstudio_id', 'zfclass_id', 'source'])
    })
    .then(() => {
      console.log('zfstudio_id', 'zfclass_id', 'source')
      queryInterface.removeIndex('events', ['zfstudio_id', 'source', 'zfsite_id'])
    })
    .then(() => {
      console.log('zfstudio_id', 'source', 'zfsite_id')
      queryInterface.removeIndex('events', ['mbstudioid', 'source', 'mblocationid'])
    })
    .then(() => {
      console.log('mbstudio', 'source', 'mblocationid')
      queryInterface.removeIndex('events', ['source'])
    })
    .then(() => {
      console.log('source')
      queryInterface.removeIndex('events', ['zfstudio_id'])
    })
    .then(() => {
      console.log('zfstudio_id')

      queryInterface.removeIndex('events', ['mbstudioid'])
    })

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
