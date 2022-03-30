'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('duplicate_users', 'dibs_user_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_user_studios',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('duplicate_users', 'dibs_user_studio_id');
  }
};
