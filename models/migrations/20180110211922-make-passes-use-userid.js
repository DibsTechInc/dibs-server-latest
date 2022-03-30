'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('passes', 'dibs_user_id', 'userid')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('passes', 'userid', 'dibs_user_id')
  }
};
