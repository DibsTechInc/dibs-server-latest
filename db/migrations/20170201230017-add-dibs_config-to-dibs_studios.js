'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'dibs_config', {
      type: Sequelize.JSON,
      defaultValue: {
        color: '#e5d400',
        interval_end: 14,
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'dibs_config');
  }
};
