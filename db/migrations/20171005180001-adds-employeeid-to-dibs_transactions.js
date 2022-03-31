'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'employeeid',  {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'employeeid');
  }
};
