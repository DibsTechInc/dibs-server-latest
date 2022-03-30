'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('dibs_user_autopay_packages', 'dibs_user_id', 'userid')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('dibs_user_autopay_packages', 'userid', 'dibs_user_id')
  }
};
