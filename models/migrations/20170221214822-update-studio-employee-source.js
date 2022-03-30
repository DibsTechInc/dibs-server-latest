'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('studio_employees', 'source', {
      type: Sequelize.STRING(4),
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('studio_employees', 'source', {
      type: Sequelize.STRING(2),
    });
  }
};
