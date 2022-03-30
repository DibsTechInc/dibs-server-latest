'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('friend_referrals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id'
        },
      },
      email: Sequelize.STRING,
      normalizedEmail: Sequelize.STRING,
      referredUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id'
        },
      },
      creditsAwarded: Sequelize.FLOAT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('friend_referrals', ['id']))
    .then(() => queryInterface.addIndex('friend_referrals', ['userid']))
    .then(() => queryInterface.addIndex('friend_referrals', ['email']))
    .then(() => queryInterface.addIndex('friend_referrals', ['normalizedEmail']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('friend_referrals');
  }
};
