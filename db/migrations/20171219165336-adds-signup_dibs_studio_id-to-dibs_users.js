'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-12-19/update-dibs_users.sql`);
    await queryInterface.addColumn('dibs_users', 'signup_dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    });
    return queryInterface.sequelize.query(QUERY);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'signup_dibs_studio_id');
  }
};
