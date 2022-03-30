'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_studios', 'intro_promo_code_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_studios', 'intro_promo_code_id', {
      type: Sequelize.INTEGER,
      defaultValue: 3,
    });
  }
};
