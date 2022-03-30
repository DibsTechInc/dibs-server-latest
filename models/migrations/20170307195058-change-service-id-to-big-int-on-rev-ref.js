'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('revenue_reference', 'serviceID', { type: Sequelize.BIGINT })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('revenue_reference', 'serviceID', { type: Sequelize.INTEGER })

  }
};
