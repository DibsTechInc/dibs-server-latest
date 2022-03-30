'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query('UPDATE studio_pricings SET min_price = 0 WHERE min_price IS NULL');
    queryInterface.sequelize.query('UPDATE studio_pricings SET max_price = 0 WHERE max_price IS NULL');
    await queryInterface.changeColumn('studio_pricings', 'min_price', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    return queryInterface.changeColumn('studio_pricings', 'max_price', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('studio_pricings', 'min_price', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    return queryInterface.changeColumn('studio_pricings', 'max_price', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  }
};
