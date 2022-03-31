'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('attendees', 'cost', Sequelize.FLOAT).then(() => {
      queryInterface.addColumn('attendees', 'source', Sequelize.STRING(4));
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('attendees', 'cost').then(() => {
      queryInterface.removeColumn('attendees', 'source');
    });
  }
};
