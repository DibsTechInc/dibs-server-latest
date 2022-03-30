'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_users', 'suppression_lists', { type: Sequelize.JSON,
      defaultValue: {
      transactional: false,
        nontransactional: false,
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_users', 'suppression_lists')
  }
};
