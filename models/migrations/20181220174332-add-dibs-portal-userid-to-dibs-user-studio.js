'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_user_studios', 'dibs_portal_userid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_user_studios', 'dibs_portal_userid');
  }
};
