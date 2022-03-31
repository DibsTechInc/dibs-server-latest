'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('events', 'zoom_password', {
      type: Sequelize.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('events', 'zoom_password', {
      type: Sequelize.FLOAT,
    });
  },
};

