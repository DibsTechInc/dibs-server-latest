'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('dibs_studio_instructors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studioid: {
        type: Sequelize.INTEGER,
      },
      source: {
        type: Sequelize.STRING(4),
      },
      source_instructor_id: Sequelize.INTEGER,
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
      email: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('dibs_studio_instructors', ['studioid', 'source']))
    .then(() => queryInterface.addIndex('dibs_studio_instructors', ['source_instructor_id', 'studioid', 'source'], { unique: true }))
    .then(() => queryInterface.sequelize.query(`
      INSERT INTO dibs_studio_instructors (
        studioid,
        source,
        source_instructor_id,
        firstname,
        lastname,
        enabled,
        "createdAt",
        "updatedAt"
      )
        SELECT
          mbstudioid,
          'mb',
          mbuserid,
          firstname,
          lastname,
          TRUE,
          "createdAt",
          "updatedAt"
        FROM mb_users
    `))
    .then(() => queryInterface.sequelize.query(`
      INSERT INTO dibs_studio_instructors (
        studioid,
        source,
        source_instructor_id,
        firstname,
        lastname,
        email,
        enabled,
        "createdAt",
        "updatedAt"
      )
        SELECT
          zfstudio_id,
          'zf',
          zfinstructor_id,
          firstname,
          lastname,
          email,
          enabled,
          "createdAt",
          "updatedAt"
        FROM zf_instructors
    `))
    ;

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('dibs_studio_instructors', ['studioid', 'source'])
      .then(() => queryInterface.removeIndex('dibs_studio_instructors', ['source_instructor_id']))
      .then(() => queryInterface.dropTable('dibs_studio_instructors'));
  }
};
