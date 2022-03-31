'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('dibs_studio_locations', {
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
      region_id: Sequelize.INTEGER,
      source_location_id: Sequelize.INTEGER,
      name: Sequelize.STRING,
      phone: Sequelize.STRING,
      address: Sequelize.STRING,
      address2: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      zipcode: Sequelize.STRING,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
      tax_rate: Sequelize.FLOAT,
      visible: Sequelize.BOOLEAN,
      short_name: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('dibs_studio_locations', ['studioid', 'source']))
    .then(() => queryInterface.addIndex('dibs_studio_locations', ['source_location_id', 'studioid', 'source'], { unique: true }))
    .then(() => queryInterface.sequelize.query(`
      INSERT INTO dibs_studio_locations (
        studioid,
        source,
        source_location_id,
        name,
        phone,
        address,
        address2,
        city,
        state,
        zipcode,
        latitude,
        longitude,
        tax_rate,
        visible,
        short_name,
        "createdAt",
        "updatedAt"
      )
        SELECT
          mbstudioid,
          'mb',
          mblocationid,
          name,
          phone,
          address,
          address2,
          city,
          state,
          zipcode,
          latitude,
          longitude,
          tax_rate,
          visible,
          short_name,
          "createdAt",
          "updatedAt"
        FROM mb_locations
    `))
    .then(() => queryInterface.sequelize.query(`
      INSERT INTO dibs_studio_locations (
        studioid,
        source,
        source_location_id,
        name,
        region_id,
        address,
        address2,
        city,
        state,
        zipcode,
        "deletedAt",
        tax_rate,
        visible,
        "createdAt",
        "updatedAt"
      )
        SELECT
          zfstudio_id,
          'zf',
          zfsite_id,
          name,
          zfregion_id,
          address,
          address2,
          city,
          state,
          zip,
          "deletedAt",
          tax_rate,
          visible,
          "createdAt",
          "updatedAt"
        FROM zf_sites
    `))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('dibs_studio_locations');
  }
};
