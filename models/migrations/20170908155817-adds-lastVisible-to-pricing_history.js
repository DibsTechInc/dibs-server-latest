'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('pricing_history', 'lastVisible', {
      type: Sequelize.DATE,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('pricing_history', 'lastVisible');
  }
};
