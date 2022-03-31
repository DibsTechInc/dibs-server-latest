'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('attendees', 'clientID', {type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('attendees', 'clientID', {type: Sequelize.INTEGER})

  }
};
