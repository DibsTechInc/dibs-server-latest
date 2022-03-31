'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('passes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      studio_package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'studio_packages',
          key: 'id',
        },
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        },
      },
      dibs_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_transactions',
          Key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      deletedAt: Sequelize.DATE,
      expiresAt: Sequelize.DATE,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('passes');
  }
};
