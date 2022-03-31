'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('mb_pseudo_client_services', 'pseudo_client_services')
    .then(() => queryInterface.addColumn('pseudo_client_services', 'source', Sequelize.STRING(4)))
    .then(() => queryInterface.sequelize.query("UPDATE pseudo_client_services SET source = 'mb'"))
  },

  down: function (queryInterface, Sequelize) {
    return
    queryInterface.sequelize.query("DELETE FROM pseudo_client_services WHERE source != 'mb'")
    .then(() => queryInterface.removeColumn('pseudo_client_services', 'source'))
    .then(() => queryInterface.renameTable('pseudo_client_services', 'mb_pseudo_client_services'))
  }
};
