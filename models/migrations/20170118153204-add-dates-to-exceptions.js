'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('exceptions', 'createdAt', Sequelize.DATE)
    .then(() => (
      queryInterface.addColumn('exceptions', 'updatedAt', Sequelize.DATE)
    ));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('exceptions', 'createdAt')
    .then(() => queryInterface.removeColumn('exceptions', 'updatedAt'));
  }
};
