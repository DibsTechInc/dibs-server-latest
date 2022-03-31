'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('dibs_user_autopay_packages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      studio_packages_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'studio_packages',
          key: 'id',
        },
      },
      dibs_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id',
        },
      },
      stripe_subscription_id: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      deletedAt: Sequelize.DATE,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('dibs_user_autopay_packages')
  },
};
