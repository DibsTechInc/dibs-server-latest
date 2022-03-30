'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('special_notifications', 'widget_path', { type: Sequelize.STRING }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('special_notifications', 'widget_path'),
};
