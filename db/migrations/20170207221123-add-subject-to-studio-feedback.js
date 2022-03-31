'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_feedbacks', 'subject', { type: Sequelize.TEXT })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_feedbacks', 'subject')
  }
};
