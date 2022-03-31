'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE revenue_reference ALTER COLUMN "serviceID" TYPE VARCHAR(30) USING "serviceID"::VARCHAR(30);')
      .then(() => queryInterface.sequelize.query(`
        UPDATE exceptions SET trainerid = (
          SELECT dsi.id
          FROM dibs_studio_instructors dsi
          WHERE dsi.source_instructor_id::VARCHAR = trainerid::VARCHAR
          AND dsi.dibs_studio_id = exceptions.dibs_studio_id
        );
      `))
      .then(() => queryInterface.sequelize.query(`
        UPDATE exceptions SET locationid = (
          SELECT dsl.id
          FROM dibs_studio_locations dsl
          WHERE dsl.source_location_id::VARCHAR = locationid::VARCHAR
          AND dsl.dibs_studio_id = exceptions.dibs_studio_id
          AND dsl.source = exceptions.source
        );
      `))
      .then(() => queryInterface.sequelize.query(`
        UPDATE events SET locationid = (
          CASE
            WHEN locationid = 84 THEN 1049362
            ELSE 1049352
          END
        )
        WHERE dibs_studio_id = 2
      `))
      .then(() => queryInterface.sequelize.query(`
        UPDATE studio_invoices
        SET locationid = (
          SELECT dsl.id
          FROM dibs_studio_locations dsl
          WHERE dsl.dibs_studio_id = studio_invoices.dibs_studio_id
          AND dsl.source = studio_invoices.source
          AND dsl.source_location_id::VARCHAR = studio_invoices.locationid::VARCHAR
        )
        WHERE locationid IS NOT NULL AND locationid > 0;
      `));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE revenue_reference ALTER COLUMN "serviceID" TYPE INTEGER USING "serviceID"::INTEGER;')
      .then(() => queryInterface.sequelize.query(`
        UPDATE exceptions SET trainerid = (
          SELECT dsi.source_instructor_id::INT
          FROM dibs_studio_instructors dsi
          WHERE dsi.id = trainerid
          AND dsi.dibs_studio_id = exceptions.dibs_studio_id
        );
      `))
      .then(() => queryInterface.sequelize.query(`
        UPDATE exceptions SET locationid = (
          SELECT dsl.source_location_id::INT
          FROM dibs_studio_locations dsl
          WHERE dsl.id = locationid
          AND dsl.dibs_studio_id = exceptions.dibs_studio_id
          AND dsl.source = exceptions.source
        );
      `))
      .then(() => queryInterface.sequelize.query(`
        UPDATE events SET locationid = (
          CASE
            WHEN locationid = 1049362 THEN 84
            ELSE 85
          END
        )
        WHERE dibs_studio_id = 2
      `))
      .then(() => queryInterface.sequelize.query(`
        UPDATE studio_invoices
        SET locationid = (
          SELECT dsl.source_location_id::INT
          FROM dibs_studio_locations dsl
          WHERE dsl.dibs_studio_id = studio_invoices.dibs_studio_id
          AND dsl.source = studio_invoices.source
          AND dsl.id = studio_invoices.locationid
        )
        WHERE locationid IS NOT NULL AND locationid > 0;
      `));
  }
};
