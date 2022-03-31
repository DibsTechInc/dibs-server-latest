'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'card_country', {
      type: Sequelize.STRING(2),
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'card_country');
  }
};
