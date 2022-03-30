'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('events', 'mbclassid', { type: Sequelize.BIGINT })
    .then(() => queryInterface.changeColumn('attendees', 'classID', { type: Sequelize.BIGINT }))
    .then(() => queryInterface.changeColumn('data_attendees', 'classID', { type: Sequelize.BIGINT }))

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('events', 'mbclassid', { type: Sequelize.INTEGER })
    .then(() => queryInterface.changeColumn('attendees', 'classID', { type: Sequelize.INTEGER }))
    .then(() => queryInterface.changeColumn('data_attendees', 'classID', { type: Sequelize.INTEGER }))

  }
};
