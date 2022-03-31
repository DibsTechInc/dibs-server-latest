'use strict';
const Promise = require('bluebird');

const tableColumns = [{
  table: 'dibs_users',
  columns: ['"firstName"', '"lastName"', 'email', 'mobilephone'],
}
]

function combineColumnText(columns) {
  return columns.map(column => `COALESCE(${column}, '')`).join(" || ' ' || ");
}

function toVector(columns) {
  return `to_tsvector('english', ${combineColumnText(columns)})`
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.map(tableColumns, async (tc) => {
      await queryInterface.sequelize.query(`UPDATE ${tc.table} SET ft_search = ${toVector(tc.columns)} WHERE ft_search IS NULL`)
      return queryInterface.sequelize.query(`CREATE TRIGGER ${tc.table}_ft_search_insert_tgr_w_mobilephone
        AFTER INSERT
        ON ${tc.table}
        FOR EACH ROW
        EXECUTE PROCEDURE update_${tc.table}_ft_search();
        `)
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.map(tableColumns, async (tc) => {
      await queryInterface.sequelize.query(`DROP TRIGGER ${tc.table}_ft_search_insert_tgr_w_mobilephone ON ${tc.table};`)
    });
  }
};