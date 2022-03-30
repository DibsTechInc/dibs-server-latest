'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_admin_tile_datas', 'locations', Sequelize.DataTypes.INTEGER)
    .then(() => queryInterface.removeIndex('studio_admin_tile_datas', ['source', 'studioid', 'tableName']))
    .then(() => queryInterface.addIndex('studio_admin_tile_datas', ['source', 'studioid', 'tableName', 'locations'], { unique: true }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('studio_admin_tile_datas', ['source', 'studioid', 'tableName', 'locations'])
    .then(() => queryInterface.removeColumn('studio_admin_tile_datas', 'locations'))
    .then(() => queryInterface.addIndex('studio_admin_tile_datas', ['source', 'studioid', 'tableName']))

  }
};
