'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'fee_rate', 'widget_fee_rate')
      .then(() => queryInterface.addColumn('dibs_studios', 'admin_fee_rate', {
        type: Sequelize.FLOAT,
      }))
      .then(() => queryInterface.sequelize.query(
        'UPDATE dibs_studios SET admin_fee_rate = widget_fee_rate;'
      ));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'widget_fee_rate', 'fee_rate')
      .then(() => queryInterface.removeColumn('dibs_studios', 'admin_fee_rate'));
  }
};
