'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('events', ['dibs_studio_id'])
      .then(() => queryInterface.addIndex('events', ['name']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('events', ['dibs_studio_id'])
      .then(() => queryInterface.removeIndex('events', ['name']));
  }
};
