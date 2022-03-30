'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('revenue_reference', ['DibsCategory2'], { unique: false });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('revenue_reference', ['DibsCategory2']);
  }
};
