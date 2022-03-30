'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('special_notifications', 'showFrom', {
      type: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('special_notifications', 'showFrom');
  }
};
