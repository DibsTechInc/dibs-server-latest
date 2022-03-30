'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users','third_party_generated', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users','third_party_generated')
  }
};
