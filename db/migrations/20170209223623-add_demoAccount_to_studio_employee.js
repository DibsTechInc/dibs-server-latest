'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_employees', 'demoAccount', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_employees', 'demoAccount')

  }
};
