'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('events', {
      eventid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      eventtype: {
        type: Sequelize.STRING
      },
      trainerid: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.FLOAT
      },
      mb_price: {
        type: Sequelize.FLOAT
      },
      description: {
        type: Sequelize.TEXT
      },
      start: {
        type: Sequelize.FLOAT
      },
      end: {
        type: Sequelize.FLOAT
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      seats: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      popular: {
        type: Sequelize.INTEGER
      },
      canceled: {
        type: Sequelize.INTEGER
      },
      deleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      mbstudioid: {
        type: Sequelize.INTEGER
      },
      mbprogramid: {
        type: Sequelize.INTEGER
      },
      mbclassid: {
        type: Sequelize.INTEGER
      },
      mblocationid: {
        type: Sequelize.INTEGER
      },
      source: {
        type: Sequelize.STRING
      },
      disable_sync_location: {
        type: Sequelize.INTEGER
      },
      manual_track_id: {
        type: Sequelize.STRING
      },
      price_venus: {
        type: Sequelize.FLOAT
      },
      zfstudio_id: {
        type: Sequelize.INTEGER
      },
      zfsite_id: {
        type: Sequelize.INTEGER
      },
      zfinstructor_id: {
        type: Sequelize.INTEGER
      },
      zfclass_id: {
        type: Sequelize.INTEGER
      },
      zfisfull: {
        type: Sequelize.BOOLEAN
      },
      price_dibs: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      spots_booked: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      dibs_classid: Sequelize.STRING(100),
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('events')
  }
};
