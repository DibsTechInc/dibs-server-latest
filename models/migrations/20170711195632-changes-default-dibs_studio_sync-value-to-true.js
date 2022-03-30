'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_studios', 'sync', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_studios', 'sync', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  }
};
