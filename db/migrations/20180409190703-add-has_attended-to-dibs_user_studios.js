'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_user_studios', 'has_attended', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
    return queryInterface.sequelize.query('update dibs_user_studios set has_attended = true from attendees where attendees.dibs_studio_id = dibs_user_studios.dibs_studio_id and attendees.userid = dibs_user_studios.userid and attendees.checkedin = true;')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_user_studios', 'has_attended')
  }
};
