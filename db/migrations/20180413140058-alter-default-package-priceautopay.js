'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query('UPDATE studio_packages SET "priceAutopay" = 0 WHERE "priceAutopay" IS NULL')
    return queryInterface.changeColumn('studio_packages', 'priceAutopay', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('studio_packages', 'priceAutopay', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
