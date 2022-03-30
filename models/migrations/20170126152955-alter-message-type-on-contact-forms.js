'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'contact_forms',
      'message',
      {
        type: Sequelize.TEXT,
      }
    )
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'contact_forms',
      'message',
      {
        type: Sequelize.STRING,
      }
    )
  }
};
