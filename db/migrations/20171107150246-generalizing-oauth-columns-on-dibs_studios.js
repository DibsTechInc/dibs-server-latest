'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'pike13_clientid', 'client_id').then(() =>
      queryInterface.renameColumn('dibs_studios', 'pike13_secret', 'client_secret')
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'client_id', 'pike13_clientid').then(() =>
      queryInterface.renameColumn('dibs_studios', 'client_secret', 'pike13_secret')
    )
  }
};
