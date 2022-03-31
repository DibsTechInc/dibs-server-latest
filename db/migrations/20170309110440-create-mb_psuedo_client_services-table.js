'use strict';
const _ = require('lodash');
const models = require('../');
const Promise = require('bluebird');
module.exports = {

  up: function (queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;
    let attendeeStudios = [];
    return queryInterface.createTable('mb_pseudo_client_services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studioid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'mb_studios',
          key: 'mbstudioid',
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('NOW'),
      },
      updatedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('mb_pseudo_client_services', ['studioid', 'name'], { unique: true }))
    .then(() => sequelize.query('SELECT DISTINCT "studioID" from attendees where source = \'mb\''))
    .then((studios) => {
      attendeeStudios = studios[0].map(studio => studio.studioID)
      return attendeeStudios;
    })
    .then(studioids => sequelize.query('SELECT DISTINCT "studioID", "serviceName" from attendees WHERE source = \'mb\' ORDER BY "studioID", "serviceName"'))
    .then(attendees => attendees[0].map(attendee => ({ name: attendee.serviceName, studioid: attendee.studioID })))
    .then((uniqServices) => {
      const data = uniqServices.map((service, i) => ({
        id: i + 1,
        studioid: service.studioid,
        name: service.name,
      }));

      return queryInterface.bulkInsert('mb_pseudo_client_services', data);
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('mb_pseudo_client_services', ['studioid', 'name'])
    .then(() => queryInterface.dropTable('mb_pseudo_client_services'))
  }
}
