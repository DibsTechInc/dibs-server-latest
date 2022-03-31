'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-11-06/replace-dibs-admin-metric-table-functions.sql`);
    return queryInterface.sequelize.query(QUERY);
  },

  down: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-10-09/replace-dibs-admin-metric-table-functions.sql`);
    return queryInterface.sequelize.query(QUERY);
  }
};
