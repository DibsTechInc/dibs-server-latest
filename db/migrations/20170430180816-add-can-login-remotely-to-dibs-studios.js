'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('dibs_studios', 'canRemotelyLogin', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'canRemotelyLogin');
  }
};
