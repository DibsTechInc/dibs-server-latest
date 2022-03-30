'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP MATERIALIZED VIEW visits_per_customer;
      DROP MATERIALIZED VIEW visits_by_month;
      DROP MATERIALIZED VIEW percent_visits_on_dibs;
      DROP MATERIALIZED VIEW monthly_revenues;
      DROP MATERIALIZED VIEW metric_tables;
      DROP MATERIALIZED VIEW avg_per_customer;
      DROP MATERIALIZED VIEW average_visits_per_customer;
      DROP MATERIALIZED VIEW data_attendees_view;
      DROP TABLE data_attendees;
      DROP MATERIALIZED VIEW all_studios CASCADE;
    `);
  },

  down: function (queryInterface, Sequelize) {
    const query = parseSQL(`${__dirname}/queries/2017-03-19/create-data-attendees.sql`);
    return queryInterface.sequelize.query(query)
  }
};
