'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('dibs_transactions', 'studio_package_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'studio_packages',
        key: 'id',
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('dibs_transactions', 'studio_package_id');
  }
};
