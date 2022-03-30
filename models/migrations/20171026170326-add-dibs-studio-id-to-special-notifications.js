'use strict';
const models = require('../');
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('special_notifications', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id'
      },
    })
    .then(() => models.sequelize.query(`
      UPDATE
        special_notifications
      SET dibs_studio_id = (
        SELECT
          dibs_studios.id
        FROM
          dibs_studios
        WHERE dibs_studios.studioid = special_notifications.studioid
          AND dibs_studios.source = special_notifications.source
      );
    `))
    .then(() => queryInterface.removeColumn('special_notifications', 'studioid'))
    .then(() => queryInterface.removeColumn('special_notifications', 'source'))
    .then(() => queryInterface.addIndex('special_notifications', ['dibs_studio_id']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('special_notifications', 'source', Sequelize.STRING(4))
      .then(() => queryInterface.addColumn('special_notifications', 'studioid', Sequelize.INTEGER))
      .then(() => queryInterface.addIndex('special_notifications', ['source', 'studioid']))
      .then(() => models.sequelize.query(`
        UPDATE special_notifications
        SET source = (
          SELECT
            dibs_studios.source
          FROM
            dibs_studios
          WHERE dibs_studios.id = special_notifications.dibs_studio_id
        ),
          studioid = (
            SELECT
              dibs_studios.studioid
            FROM
              dibs_studios
            WHERE dibs_studios.id = special_notifications.dibs_studio_id
          )
      `))
    .then(() => queryInterface.removeColumn('special_notifications', 'dibs_studio_id'))
  }
};
