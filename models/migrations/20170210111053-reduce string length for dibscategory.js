'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('revenue_reference', 'DibsCategory2', {type: Sequelize.STRING(3) })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('revenue_reference', 'DibsCategory2', {type: Sequelize.STRING(255)})
  }
};
