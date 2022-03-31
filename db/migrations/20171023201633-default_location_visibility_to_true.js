'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_studio_locations', 'visible', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_studio_locations', 'visible', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  }
};
