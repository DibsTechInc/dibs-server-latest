'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');
const updatePctDibsVisits = parseSQL(`${__dirname}/queries/2017-03-20/update-percent-dibs-visits.sql`);
const rollback = parseSQL(`${__dirname}/queries/2017-03-20/rollback-percent-dibs-visits.sql`);

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(updatePctDibsVisits);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(rollback);
  }
};
