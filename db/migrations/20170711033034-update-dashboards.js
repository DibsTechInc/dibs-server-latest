'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: function (queryInterface, Sequelize) {
    const STUDIO_LOCATIONS = parseSQL(`${__dirname}/queries/2017-05-26/new-studio-with-locations-mview.sql`);
    const NEW_DATA_ATTENDDE_MVIEW = parseSQL(`${__dirname}/queries/2017-05-26/new-data-attendees-mview.sql`);
    const NEW_DATA_ATTENDDE_TRIGGER = parseSQL(`${__dirname}/queries/2017-05-26/new-data-attendee-trigger.sql`);

    const metric_tables = parseSQL(`${__dirname}/queries/2017-04-17/update-metric-table-mview.sql`);
    const percent_visits_on_dibs = parseSQL(`${__dirname}/queries/2017-03-20/update-percent-dibs-visits.sql`);
    const monthly_revenues = parseSQL(`${__dirname}/queries/2017-03-19/monthly-revenues.sql`);
    const visits_by_month = parseSQL(`${__dirname}/queries/2017-03-19/visits-by-month.sql`);
    const avg_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/avg_per_customer.sql`);
    const visits_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/visits-per-customer.sql`);
    const avg_visits_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/avg-visits-per-customer.sql`);
    return queryInterface.sequelize.query(STUDIO_LOCATIONS)
      .then(() => queryInterface.sequelize.query(NEW_DATA_ATTENDDE_MVIEW))
      .then(() => queryInterface.sequelize.query(NEW_DATA_ATTENDDE_TRIGGER))
      .then(() => queryInterface.sequelize.query(metric_tables))
      .then(() => queryInterface.sequelize.query(percent_visits_on_dibs))
      .then(() => queryInterface.sequelize.query(monthly_revenues))
      .then(() => queryInterface.sequelize.query(visits_by_month))
      .then(() => queryInterface.sequelize.query(avg_per_customer))
      .then(() => queryInterface.sequelize.query(visits_per_customer))
      .then(() => queryInterface.sequelize.query(avg_visits_per_customer));
  },

  down: function (queryInterface, Sequelize) {
    const ROLLBACK_STUDIO_LOCATIONS = parseSQL(`${__dirname}/queries/2017-05-26/roll-back-studio-with-locations-mview.sql`);
    const ROLLBACK_DATA_ATTENDDE_MVIEW = parseSQL(`${__dirname}/queries/2017-05-26/roll-back-studio-with-locations-mview.sql`);
    const ROLLBACK_DATA_ATTENDDE_TRIGGER = parseSQL(`${__dirname}/queries/2017-05-26/roll-back-studio-with-locations-mview.sql`);
    const metric_tables = parseSQL(`${__dirname}/queries/2017-04-17/update-metric-table-mview.sql`);
    const percent_visits_on_dibs = parseSQL(`${__dirname}/queries/2017-03-20/update-percent-dibs-visits.sql`);
    const monthly_revenues = parseSQL(`${__dirname}/queries/2017-03-19/monthly-revenues.sql`);
    const visits_by_month = parseSQL(`${__dirname}/queries/2017-03-19/visits-by-month.sql`);
    const avg_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/avg_per_customer.sql`);
    const visits_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/visits-per-customer.sql`);
    const avg_visits_per_customer = parseSQL(`${__dirname}/queries/2017-03-19/avg-visits-per-customer.sql`);

    return queryInterface.sequelize.query(ROLLBACK_STUDIO_LOCATIONS)
      .then(() => queryInterface.sequelize.query(ROLLBACK_DATA_ATTENDDE_MVIEW))
      .then(() => queryInterface.sequelize.query(ROLLBACK_DATA_ATTENDDE_TRIGGER))
      .then(() => queryInterface.sequelize.query(metric_tables))
      .then(() => queryInterface.sequelize.query(percent_visits_on_dibs))
      .then(() => queryInterface.sequelize.query(monthly_revenues))
      .then(() => queryInterface.sequelize.query(visits_by_month))
      .then(() => queryInterface.sequelize.query(avg_per_customer))
      .then(() => queryInterface.sequelize.query(visits_per_customer))
      .then(() => queryInterface.sequelize.query(avg_visits_per_customer));
  }
};
