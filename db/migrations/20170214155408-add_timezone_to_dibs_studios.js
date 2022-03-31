'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'mainTZ', {
      type: Sequelize.STRING(40),
      defaultValue: 'America/New_York',
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'mainTZ')
  }
};
