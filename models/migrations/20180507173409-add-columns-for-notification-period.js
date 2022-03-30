'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('dibs_user_autopay_packages', 'cancel_notified_at', Sequelize.DATE),
      queryInterface.addColumn('studio_packages', 'notification_period', Sequelize.INTEGER),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('dibs_user_autopay_packages', 'cancel_notified_at'),
      queryInterface.removeColumn('studio_packages', 'notification_period'),
    ])
  }
};
