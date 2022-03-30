'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_transactions', 'zf_attendance_id', 'saleid')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_transactions', 'saleid', 'zf_attendance_id')

  }
};
