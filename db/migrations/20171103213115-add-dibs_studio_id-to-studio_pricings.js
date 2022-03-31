'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_pricings', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_pricings', 'dibs_studio_id');
  }
};
