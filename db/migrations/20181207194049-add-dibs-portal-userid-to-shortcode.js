'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('short_codes', 'dibs_portal_userid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('short_codes', 'dibs_portal_userid');
  }
};
