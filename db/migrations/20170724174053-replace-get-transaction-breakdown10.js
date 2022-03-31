'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-07-24/replace-get_transaction_breakdown.sql`);
    return queryInterface.sequelize.query(QUERY);
  },

  down: function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-07-10/replace-get_transaction_breakdown.sql`);
    return queryInterface.sequelize.query('DROP FUNCTION IF EXISTS get_transaction_breakdown(transid INTEGER);')
      .then(() => queryInterface.sequelize.query(QUERY));
  }
};
