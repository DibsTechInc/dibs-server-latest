'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('membership_subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id'
        }
      },
      planid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'membership_plans',
          key: 'id'
        }
      },
      stripe_subscription_id: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
