'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
  return queryInterface.addColumn('friend_referrals', 'referredTransactionId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'dibs_transactions',
      key: 'id'
    },
  })
  .then(() => queryInterface.addColumn('friend_referrals', 'referralAcceptedAt', {
    type: Sequelize.DATE,
  }))
  .then(() => queryInterface.addIndex('friend_referrals', ['referredTransactionId']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('friend_referrals', ['referredTransactionId'])
      .then(() => queryInterface.removeColumn('friend_referrals', 'referredTransactionId'))
      .then(() => queryInterface.removeColumn('friend_referrals', 'referralAcceptedAt'));;
  }
};
