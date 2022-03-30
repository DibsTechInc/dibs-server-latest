'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('spots', 'top_position', {
      type: Sequelize.FLOAT,
    })
    .then(() => queryInterface.addColumn('spots', 'left_position', {
      type: Sequelize.FLOAT,
    }));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('spots', 'top_position')
      .then(() => queryInterface.removeColumn('spots', 'left_position'));
  }
};
