'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('revenue_reference', ['studioID', 'serviceID'], {unique: true})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropIndex('revenue_reference', ['studioID', 'serviceID'])
  }
};
