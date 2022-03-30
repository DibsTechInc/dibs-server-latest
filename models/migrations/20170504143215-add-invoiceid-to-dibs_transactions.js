'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'invoiceid', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
    .then(() => queryInterface.sequelize.query('UPDATE dibs_transactions SET invoiceid = -1 WHERE True'));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'invoiceid');
  }
};
