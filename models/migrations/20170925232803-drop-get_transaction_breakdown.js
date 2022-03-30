'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('DROP FUNCTION IF EXISTS get_transaction_breakdown(transid INTEGER);');
  },

  down: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-09-20/replace-get_transaction_breakdown.sql`);
    return queryInterface.sequelize.query(QUERY);
  }
};
