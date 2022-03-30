'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('studio_admin_tile_datas', ['source', 'studioid', 'tableName'],  {
      indicesType: 'UNIQUE'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('studio_admin_tile_datas', ['source', 'studioid', 'tableName']);
  }
};
