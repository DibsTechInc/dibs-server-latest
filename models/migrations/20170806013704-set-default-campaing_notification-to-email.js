'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'campaign_notification', {
      type: Sequelize.STRING,
      defaultValue: 'email',
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'campaign_notification', {
      type: Sequelize.STRING,
    });
  }
};
