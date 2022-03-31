'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'cp_amount', {
      type: Sequelize.FLOAT,
      defaultValue: 16
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'cp_amount');
  }
};
