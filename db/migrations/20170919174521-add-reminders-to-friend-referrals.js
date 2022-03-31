'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('friend_referrals', 'reminderSentAts', {
      type: Sequelize.ARRAY(Sequelize.DATE),
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('friend_referrals', 'reminderSentAts');
  }
};
