'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('studio_brands', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      brandid: Sequelize.INTEGER,
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    }).then(() => queryInterface.addIndex('studio_brands', ['brandid'], { unique: false }))
    .then(() => queryInterface.addIndex('studio_brands', ['source', 'studioid'], { unique: true }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('studio_brands', ['brandid'])
    .then(() => queryInterface.removeIndex('studio_brands', ['source', 'studioid']))
    .then(() => queryInterface.dropTable('studio_brands'))
  }
};
