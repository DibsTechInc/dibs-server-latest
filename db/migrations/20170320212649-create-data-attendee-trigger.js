'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');
const DATA_ATTENDEES_TRIGGER = parseSQL(`${__dirname}/queries/2017-03-20/create-data-attendee-trigger.sql`);

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(DATA_ATTENDEES_TRIGGER);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TRIGGER new_data_attendee on attendees;
      DROP FUNCTION create_new_data_attendee();
    `);
  }
};
