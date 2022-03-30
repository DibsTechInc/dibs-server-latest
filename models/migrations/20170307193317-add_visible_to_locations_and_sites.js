'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('mb_locations', 'visible', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    })
    .then(() =>
      queryInterface.addColumn('zf_sites', 'visible', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('mb_locations', 'visible')
      .then(() =>
        queryInterface.removeColumn('zf_sites', 'visible')
      );
  }
};
