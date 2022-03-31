'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'passid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'passes',
        key: 'id',
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'passid');
  }
};
