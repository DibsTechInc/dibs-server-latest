'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'description', { type: Sequelize.TEXT })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'description')
  }
};
