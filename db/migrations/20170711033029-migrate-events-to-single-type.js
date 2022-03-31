'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('events', 'studioid', Sequelize.INTEGER)
      .then(() => queryInterface.addColumn('events', 'classid', Sequelize.BIGINT))
      .then(() => queryInterface.addColumn('events', 'programid', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('events', 'locationid', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('events', 'isFull', Sequelize.BOOLEAN))
      .then(() => queryInterface.sequelize.query(`
        UPDATE
          events
        SET
          studioid = COALESCE(events.mbstudioid, events.zfstudio_id),
          classid = COALESCE(events.mbclassid, events.zfclass_id),
          programid = events.mbprogramid,
          locationid = COALESCE(events.mblocationid, events.zfsite_id),
          "isFull" = COALESCE(events.zfisfull, events.spots_booked >= events.seats),
          trainerid = COALESCE(events.trainerid, events.zfinstructor_id)
      `))
      .then(() => queryInterface.addIndex('events', ['studioid', 'source', 'start_date']))
      .then(() => queryInterface.addIndex('events', ['programid', 'studioid', 'source']))
      .then(() => queryInterface.addIndex('events', ['classid', 'studioid', 'source', 'locationid'], { unique: true }))
      .then(() => queryInterface.addIndex('events', ['locationid', 'studioid', 'source', 'classid'], { unique: true }))
      .then(() => queryInterface.addIndex('events', ['trainerid', 'studioid', 'source', 'classid'], { unique: true }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      UPDATE
        events
      SET
        mbstudioid = events.studioid,
        mbclassid = events.classid,
        mbprogramid = events.programid,
        mblocationid = events.locationid
      WHERE events.source = 'mb'
    `)
    .then(() => queryInterface.sequelize.query(`
      UPDATE
        events
      SET
        zfstudio_id = events.studioid,
        zfclass_id = events.classid,
        zfsite_id = events.locationid,
        zfisfull = events."isFull",
        zfinstructor_id = events.trainerid
      WHERE events.source = 'zf'
    `))
    .then(() => queryInterface.removeColumn('events', 'studioid'))
    .then(() => queryInterface.removeColumn('events', 'classid'))
    .then(() => queryInterface.removeColumn('events', 'programid'))
    .then(() => queryInterface.removeColumn('events', 'locationid'))
    .then(() => queryInterface.removeColumn('events', 'isFull'));
  }
};
