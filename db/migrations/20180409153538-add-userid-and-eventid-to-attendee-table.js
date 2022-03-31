'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('attendees', 'userid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id'
      }
    })
    return queryInterface.addColumn('attendees', 'eventid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'events',
        key: 'eventid'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('attendees', 'userid')
    return queryInterface.removeColumn('attendees', 'eventid')
  }
};
