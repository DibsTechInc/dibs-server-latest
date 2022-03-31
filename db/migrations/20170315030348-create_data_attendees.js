'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');
module.exports = {
  up: function (queryInterface, Sequelize) {
    const query = parseSQL(`${__dirname}/queries/2017-03-19/create-data-attendees.sql`);
    return queryInterface.sequelize.query(query)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE data_attendees;
      DROP MATERIALIZED VIEW all_studios CASCADE;
    `);
  }
};
