'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('dibs_user_studios', 'push_token', { type: Sequelize.STRING }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('dibs_user_studios', 'push_token'),
};
