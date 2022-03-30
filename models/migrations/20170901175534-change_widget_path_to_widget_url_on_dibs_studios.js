'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'widget_pathname', 'widget_url')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'widget_url', 'widget_pathname')
  }
};
