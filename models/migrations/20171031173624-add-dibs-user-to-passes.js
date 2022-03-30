'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('passes', 'dibs_user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    })
    .then(() => queryInterface.addIndex('passes', ['dibs_user_id']))
    .then(() => queryInterface.addIndex('passes', ['studio_package_id']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('passes', ['dibs_user_id'])
      .then(() => queryInterface.removeIndex('passes', ['studio_package_id']))
      .then(() => queryInterface.removeColumn('passes', 'dibs_user_id'))
  }
};
