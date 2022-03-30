'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'domain', Sequelize.STRING)
      .then(() => queryInterface.addColumn('dibs_studios', 'studio_email', Sequelize.STRING))
      .then(() => queryInterface.addColumn('dibs_studios', 'logo', Sequelize.TEXT))
      .then(() => queryInterface.addColumn('dibs_studios', 'source_access', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('dibs_studios', 'password', Sequelize.STRING))
      .then(() => queryInterface.addColumn('dibs_studios', 'enable_location_filter', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('dibs_studios', 'status', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('dibs_studios', 'deleted', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('dibs_studios', 'source_username', Sequelize.STRING))
      .then(() => queryInterface.addColumn('dibs_studios', 'source_password', Sequelize.STRING))
      .then(() => queryInterface.addColumn('dibs_studios', 'internal_studio', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('dibs_studios', 'resync_location', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('dibs_studios', 'currency', Sequelize.STRING(3)))
      .then(() => queryInterface.addColumn('dibs_studios', 'cancel_time', Sequelize.INTEGER))
      .then(() => queryInterface.addColumn('dibs_studios', 'source_sandbox', Sequelize.BOOLEAN))
      .then(() => queryInterface.addColumn('dibs_studios', 'source_dibscode', Sequelize.TEXT))
      .then(() => queryInterface.sequelize.query(`
        UPDATE
          dibs_studios
        SET
          domain = mb_studios.domain,
          studio_email = mb_studios.email,
          enable_location_filter = mb_studios.enable_location_filter,
          status = mb_studios.status,
          deleted = mb_studios.deleted,
          source_username = mb_studios.mb_username,
          source_access = mb_studios.access,
          source_password = mb_studios.mb_password,
          logo = mb_studios.logo,
          internal_studio = mb_studios.internal_studio,
          resync_location = mb_studios.resync_location,
          currency = mb_studios.currency,
          cancel_time = mb_studios.cancel_time
        FROM mb_studios
        WHERE mb_studios.mbstudioid = dibs_studios.studioid
          and dibs_studios.source = 'mb'
      `))
      .then(() => queryInterface.sequelize.query(`
        UPDATE
          dibs_studios
        SET
          domain = zf_studios.domain,
          source_password = zf_studios.password,
          source_dibscode = zf_studios.dibscode,
          source_sandbox = zf_studios.sandbox,
          logo = zf_studios.logo,
          currency = zf_studios.currency,
          cancel_time = zf_studios.cancel_time
        FROM zf_studios
        WHERE zf_studios.zfstudio_id = dibs_studios.studioid
          and dibs_studios.source = 'zf'
      `))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'domain', Sequelize.STRING)
      .then(() => queryInterface.removeColumn('dibs_studios', 'studio_email', Sequelize.STRING))
      .then(() => queryInterface.removeColumn('dibs_studios', 'logo', Sequelize.TEXT))
      .then(() => queryInterface.removeColumn('dibs_studios', 'source_access', Sequelize.INTEGER))
      .then(() => queryInterface.removeColumn('dibs_studios', 'password', Sequelize.STRING))
      .then(() => queryInterface.removeColumn('dibs_studios', 'enable_location_filter', Sequelize.INTEGER))
      .then(() => queryInterface.removeColumn('dibs_studios', 'status', Sequelize.INTEGER))
      .then(() => queryInterface.removeColumn('dibs_studios', 'deleted', Sequelize.INTEGER))
      .then(() => queryInterface.removeColumn('dibs_studios', 'source_username', Sequelize.STRING))
      .then(() => queryInterface.removeColumn('dibs_studios', 'source_password', Sequelize.STRING))
      .then(() => queryInterface.removeColumn('dibs_studios', 'internal_studio', Sequelize.INTEGER))
      .then(() => queryInterface.removeColumn('dibs_studios', 'resync_location', Sequelize.INTEGER))
      .then(() => queryInterface.removeColumn('dibs_studios', 'currency', Sequelize.STRING(3)))
      .then(() => queryInterface.removeColumn('dibs_studios', 'cancel_time', Sequelize.INTEGER))
      .then(() => queryInterface.removeColumn('dibs_studios', 'source_sandbox', Sequelize.BOOLEAN))
      .then(() => queryInterface.removeColumn('dibs_studios', 'source_dibscode', Sequelize.TEXT));
  }
};
