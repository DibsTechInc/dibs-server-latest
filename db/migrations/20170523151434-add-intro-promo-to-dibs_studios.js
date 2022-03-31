'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'intro_promo_code_id', {
      type: Sequelize.INTEGER,
      defaultValue: 3,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'intro_promo_code_id');
  }
};
