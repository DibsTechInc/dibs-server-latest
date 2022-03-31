'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('friend_referrals', 'firstName', {
      type: Sequelize.STRING,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('friend_referrals', 'firstName');
  }
};
