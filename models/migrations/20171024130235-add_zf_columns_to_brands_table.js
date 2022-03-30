'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_brands', 'zf_domain', Sequelize.STRING)
    .then(() => queryInterface.addColumn('studio_brands', 'zf_dibscode', Sequelize.STRING))
    .then(() => queryInterface.addColumn('studio_brands', 'zf_password', Sequelize.STRING))
    .then(() => queryInterface.addColumn('studio_brands', 'zf_sandbox', Sequelize.BOOLEAN))
    .then(() => queryInterface.addColumn('studio_brands', 'sync', Sequelize.BOOLEAN))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_brands', 'zf_domain')
    .then(() => queryInterface.removeColumn('studio_brands', 'zf_dibscode'))
    .then(() => queryInterface.removeColumn('studio_brands', 'zf_password'))
    .then(() => queryInterface.removeColumn('studio_brands', 'zf_sandbox'))
    .then(() => queryInterface.addColumn('studio_brands', 'sync'))
  }
};
