'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('attendees', ['dibs_studio_id'], { unique: false })
      .then(() => queryInterface.addIndex('attendees', ['dibs_studio_id', 'email'], { unique: false }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('attendees', ['dibs_studio_id'])
      .then(() => queryInterface.removeIndex('attendees', ['dibs_studio_id', 'email']));
  }
};
