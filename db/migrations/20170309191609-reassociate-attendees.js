'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;
    return queryInterface.removeIndex('attendees', ['studioID', 'classID'])
    .then(() =>  queryInterface.removeIndex('attendees', ['studioID', 'source']))
    .then(() =>  queryInterface.removeIndex('attendees', ['studioID']))
    .then(() =>  queryInterface.removeIndex('attendees', ['clientID']))
    .then(() =>  queryInterface.removeIndex('attendees', ['studioID', 'source']))
    .then(() =>  queryInterface.removeIndex('attendees', ['email', 'serviceName', 'studioID', 'source']))
    .then(() =>  queryInterface.removeIndex('attendees', ['email']))
    .then(() =>  queryInterface.removeIndex('attendees', ['serviceName', 'studioID']))
    .then(() =>  queryInterface.removeIndex('attendees', ['visitDate']))
    .then(() => sequelize.query('update attendees set "serviceID" = mb_pseudo_client_services.id from mb_pseudo_client_services where "studioID" = mb_pseudo_client_services.studioid and "serviceName" = mb_pseudo_client_services.name;'))
    .then(() => sequelize.query('update revenue_reference set "serviceID" = mb_pseudo_client_services.id from mb_pseudo_client_services where "studioID" = mb_pseudo_client_services.studioid and "paymentCategory" = mb_pseudo_client_services.name;'))
    .then(() => queryInterface.addIndex('attendees', ['studioID', 'classID']))
    .then(() => queryInterface.addIndex('attendees', ['studioID', 'source']))
    .then(() => queryInterface.addIndex('attendees', ['serviceName', 'studioID']))
    .then(() => queryInterface.addIndex('attendees', ['studioID', 'serviceID']))

  },

  down: function (queryInterface, Sequelize) {
    // return queryInterface.addIndex('attendees', ['studioID', 'classID'])
    // .then(() =>  queryInterface.addIndex('attendees', ['studioID', 'source']))
    // .then(() =>  queryInterface.addIndex('attendees', ['studioID']))
    // .then(() =>  queryInterface.addIndex('attendees', ['clientID']))
    return queryInterface.addIndex('attendees', ['email', 'serviceName', 'studioID', 'source'])
    .then(() =>  queryInterface.addIndex('attendees', ['email']))
    .then(() =>  queryInterface.addIndex('attendees', ['serviceName', 'studioID']))
    .then(() =>  queryInterface.addIndex('attendees', ['visitDate']))
  }
};
