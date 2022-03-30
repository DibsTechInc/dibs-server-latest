'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('friend_referrals', 'method', {
      type: Sequelize.STRING(20),
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('friend_referrals', 'method');
  }
};
