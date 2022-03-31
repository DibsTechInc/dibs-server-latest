'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('revenue_reference', ['studioID'])
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('revenue_reference', ['studioID'])
  }
};
