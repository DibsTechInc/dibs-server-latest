'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('studio_admin_tile_datas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      studioid: {
        type: Sequelize.INTEGER,
      },
      tableName: {
        type: Sequelize.STRING(20)
      },
      source: {
        type: Sequelize.STRING(4),
      },
      data: {
        type: Sequelize.JSONB,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('studio_admin_tile_datas', ['studioid', 'source']))
    .then(() => queryInterface.addIndex('studio_admin_tile_datas', ['tableName']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('studio_admin_tile_datas', ['studioid', 'source'])
          .then(() => queryInterface.removeIndex('studio_admin_tile_datas', ['tableName']))
          .then(() => queryInterface.dropTable('studio_admin_tile_datas'));
  }
};
