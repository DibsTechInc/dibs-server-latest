'use strict';

const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const QUERY = parseSQL(`${__dirname}/queries/2017-12-18/add-dibs_studio_id-to-dibs_gift_cards.sql`);
    await queryInterface.addColumn('dibs_gift_cards', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
    });
    return queryInterface.sequelize.query(QUERY);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_gift_cards', 'dibs_studio_id');
  }
};
