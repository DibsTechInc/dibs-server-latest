'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('attendees', 'visitid', Sequelize.STRING).then(() =>
    queryInterface.addColumn('attendees', 'firstname', Sequelize.STRING)).then(() =>
    queryInterface.addColumn('attendees', 'lastname', Sequelize.STRING))
  },

  down: function (queryInterface, Sequelize) {

      return queryInterface.removeColumn('attendees', 'visitid').then(() =>
      queryInterface.removeColumn('attendees', 'firstname')).then(() =>
      queryInterface.removeColumn('attendees', 'lastname'))
  }
};
