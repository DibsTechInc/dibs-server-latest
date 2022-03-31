'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-08-01/create-dibs-admin-metric-table-functions.sql`);
    return queryInterface.sequelize.query(QUERY);
  },

  down: function (queryInterface, Sequelize) {
    let query = parseSQL(`${__dirname}/queries/2017-08-01/drop-dibs-admin-metric-table-functions.sql`);
    return queryInterface.sequelize
      .query(query)
      .then(() => {
        query = parseSQL(`${__dirname}/queries/2017-07-12/create-dibs-admin-metric-table-functions.sql`);
        return queryInterface.sequelize.query(query);
      });
  }
};
