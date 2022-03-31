'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_brands', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_brands', 'dibs_studio_id');
  }
};
