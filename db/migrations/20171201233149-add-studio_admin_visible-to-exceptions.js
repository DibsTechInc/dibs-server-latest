'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('exceptions', 'studio_admin_visible', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('exceptions', 'studio_admin_visible');
  }
};
