'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('revenue_reference', ['studioID', 'paymentCategory'])
    .then(() => queryInterface.addIndex('revenue_reference', ['serviceID', 'studioID'], { unique: true }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('revenue_reference', ['studioID', 'paymentCategory'])
    .then(() => queryInterface.removeIndex('revenue_reference', ['serviceID', 'studioID']))
  }
};
