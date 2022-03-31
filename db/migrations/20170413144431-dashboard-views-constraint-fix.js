'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('DROP INDEX data_attendees_view_source_studioid_locationid_email;')
  },

  down: function (queryInterface, Sequelize) {

  }
};
