'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'sync', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
    .then(() => queryInterface.sequelize.query(`
      UPDATE dibs_studios SET sync = TRUE WHERE live
    `));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'sync');
  }
};
