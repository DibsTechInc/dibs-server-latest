'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');

const studioLocationsMview = parseSQL(`${__dirname}/queries/2017-03-19/studio-with-locations-mview.sql`);
const data_attendees_view = parseSQL(`${__dirname}/queries/2017-03-19/data-attendees-mview.sql`);
const metric_tables = parseSQL(`${__dirname}/queries/2017-03-19/metric-tables-mviews.sql`);
const percent_visits_on_dibs = parseSQL(`${__dirname}/queries/2017-03-19/percent-visits-on-dibs.sql`);
const monthly_revenues = parseSQL(`${__dirname}/queries/2017-03-19/monthly-revenues.sql`);
const visits_by_month = parseSQL(`${__dirname}/queries/2017-03-19/visits-by-month.sql`);
const avg_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/avg_per_customer.sql`);
const visits_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/visits-per-customer.sql`);
const avg_visits_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/avg-visits-per-customer.sql`);

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(studioLocationsMview)
      .then(() => queryInterface.sequelize.query(data_attendees_view))
      .then(() => queryInterface.sequelize.query(metric_tables))
      .then(() => queryInterface.sequelize.query(percent_visits_on_dibs))
      .then(() => queryInterface.sequelize.query(monthly_revenues))
      .then(() => queryInterface.sequelize.query(visits_by_month))
      .then(() => queryInterface.sequelize.query(avg_per_customer))
      .then(() => queryInterface.sequelize.query(visits_per_customer))
      .then(() => queryInterface.sequelize.query(avg_visits_per_customer));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('DROP MATERIALIZED VIEW studio_with_locations CASCADE;')
      .then(() => queryInterface.sequelize.query('DROP MATERIALIZED VIEW data_attendees_view;'))
  }
};
