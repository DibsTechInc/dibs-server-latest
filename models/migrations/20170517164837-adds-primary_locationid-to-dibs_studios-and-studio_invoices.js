'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'primary_locationid', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    })
    .then(() => queryInterface.addColumn('studio_invoices', 'primary_locationid', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    }))
    .then(() => queryInterface.sequelize.query(`
      UPDATE dibs_studios SET primary_locationid = 1 WHERE TRUE;
      UPDATE dibs_studios SET primary_locationid = 3 WHERE studioid = 146718;
      UPDATE dibs_studios SET primary_locationid = 2 WHERE studioid = 2 AND source = 'zf';

      UPDATE studio_invoices SET primary_locationid = 1 WHERE TRUE;
      UPDATE studio_invoices SET primary_locationid = 3 WHERE studioid = 146718;
      UPDATE studio_invoices SET primary_locationid = 2 WHERE studioid = 2 AND source = 'zf';
    `));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'primary_locationid')
      .then(() => queryInterface.removeColumn('studio_invoices', 'primary_locationid'));
  }
};
