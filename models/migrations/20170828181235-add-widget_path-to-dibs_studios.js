'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'widget_pathname', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'widget_pathname');
  }
};
