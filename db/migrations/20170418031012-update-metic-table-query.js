'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');

const UPDATE_QUERY = parseSQL(`${__dirname}/queries/2017-04-17/update-metric-table-mview.sql`);
const ROLLBACK_QUERY = parseSQL(`${__dirname}/queries/2017-04-17/rollback-metric-table-mview.sql`);

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(UPDATE_QUERY)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(ROLLBACK_QUERY)
  }
};
