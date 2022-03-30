'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('user_studio_requests', 'visitorEmail', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('user_studio_requests', 'visitorEmail');
  }
};
