'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'front_desk', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'front_desk');
  }
};
