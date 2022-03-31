'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'late_drop_exception', {
      type: Sequelize.BOOLEAN
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'late_drop_exception');
  }
};
