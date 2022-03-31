'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-05-10/create-dibs-admin-metric-table-functions.sql`);
    return queryInterface.sequelize.query(QUERY);
  },

  down: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-04-24/drop-dibs_admin-metric_table-functions.sql`);
    return queryInterface.sequelize.query(QUERY);
  }
};
