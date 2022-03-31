'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.addColumn('dibs_transactions', 'bonus_amount', Sequelize.FLOAT);
    await queryInterface.sequelize.query(parseSQL(`${__dirname}/queries/2017-12-18/update-studio-credit-bonus.sql`));
    return queryInterface.sequelize.query(parseSQL(`${__dirname}/queries/2017-12-18/update-global-credit-bonus.sql`));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'bonus_amount');
  }
};
