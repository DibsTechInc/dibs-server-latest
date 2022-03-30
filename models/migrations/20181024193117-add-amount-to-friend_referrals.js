'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('friend_referrals', 'amount', { type: Sequelize.INTEGER }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('friend_referrals', 'amount'),
};
