'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('friend_referral_reminders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      friendReferralId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'friend_referrals',
          key: 'id'
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('friend_referral_reminders', ['friendReferralId', 'createdAt'], { unique: true }))
    .then(() => queryInterface.removeColumn('friend_referrals', 'reminderSentAts'));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('friend_referral_reminders')
      .then(() => queryInterface.addColumn('friend_referrals', 'reminderSentAts', Sequelize.ARRAY(Sequelize.DATE)))
  }
};
