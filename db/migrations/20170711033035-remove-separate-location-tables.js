'use strict';
const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('zf_sites')
    .then(() => queryInterface.dropTable('mb_locations'));
  },

  down: function (queryInterface, Sequelize) {

  }
};
