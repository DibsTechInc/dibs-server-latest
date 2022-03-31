'use strict';
const models = require('../');
const Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('zf_services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studioid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'zf_studios',
          key: 'zfstudio_id',
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
    .then(() => queryInterface.addIndex('zf_services', ['studioid', 'name'], { unique: true }))
    .then(() => Promise.all([
      models.attendees.findAll({ where: { studioID: 2, source: 'zf' }}),
      models.attendees.findAll({ where: { studioID: 3, source: 'zf' }}),
    ]))
    .spread((mhrcAttendees, lyncAttendees) => Promise.all([
      Promise.map(mhrcAttendees, attendee => attendee.serviceName),
      Promise.map(lyncAttendees, attendee => attendee.serviceName),
    ]))
    .spread((mhrcServices, lyncServices) => {
      const mhrc = [...new Set(mhrcServices)].sort();
      const lync = [...new Set(lyncServices)].sort();
      const mhrcValues = Promise.map(mhrc, service => ({studioid: 2, name: service }))
      const lyncValues = Promise.map(lync, service => ({studioid: 3, name: service }))
      return Promise.all([mhrcValues, lyncValues]);
    })
    .spread((mhrcValues, lyncValues) => {
      const values = mhrcValues.concat(lyncValues)
                               .map((val, index) => ({
                                 id: index+1,
                                 studioid: val.studioid,
                                 name: val.name })
                               );
      return queryInterface.bulkInsert('zf_services', values)
    })
    .then(() => Promise.all([
      models.attendees.findAll({ where: { studioID: 2, source: 'zf' }}),
      models.attendees.findAll({ where: { studioID: 3, source: 'zf' }}),
      models.revenue_reference.findAll({ where: { studioID: 2 }}),
      models.revenue_reference.findAll({ where: { studioID: 3 }}),
    ]))
    .spread((mhrcAttendees, lyncAttendees, mhrcRevRef, lyncRevRef) => {
      const attendees = mhrcAttendees.concat(lyncAttendees);
      const revRefs = mhrcRevRef.concat(lyncRevRef);
      console.log(attendees.length, revRefs.length)
      return Promise.all([
        attendees,
        revRefs,
      ])
    })
    .spread((attendees, revRefs) => {
      const attendeesSync = Promise.each(attendees, attendee => {
        return queryInterface.sequelize.query('SELECT id FROM zf_services WHERE studioid = $studioid AND name = $name LIMIT 1', {
          type: queryInterface.sequelize.SELECT,
          bind: {
            name: attendee.serviceName,
            studioid: attendee.studioID,
          }
        })
        .then(res => {
          if (res && res[0][0]) {
            return attendee.update({ serviceID: res[0][0].id })
          }
          return Promise.resolve()
        })
      })
      const revRefSync = Promise.each(revRefs, revRef => {
        return queryInterface.sequelize.query('SELECT id FROM zf_services WHERE studioid = $studioid AND name = $name LIMIT 1', {
          type: queryInterface.sequelize.SELECT,
          bind: {
            name: revRef.paymentCategory,
            studioid: revRef.studioID,
          }
        })
        .then(res => {
          if (res && res[0][0]) {
            return revRef.update({ serviceID: res[0][0].id })
          }
          return Promise.resolve()
        })
      })
      return Promise.all([attendeesSync, revRefSync])
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('zf_services', ['studioid', 'name'])
      .then(() => queryInterface.dropTable('zf_services'))
  }
};
