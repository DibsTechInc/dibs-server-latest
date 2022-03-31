'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('attendees', 'early_cancel', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('attendees', 'early_cancel');
  }
};
