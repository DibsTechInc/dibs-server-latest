'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('dibs_configs', 'first_class_fixed_price', {
      type: Sequelize.FLOAT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'UPDATE dibs_configs SET first_class_fixed_price = ROUND(first_class_fixed_price::NUMERIC, 0)::FLOAT;'
    );
    return queryInterface.changeColumn('dibs_configs', 'first_class_fixed_price', {
      type: Sequelize.INTEGER,
    });
  }
};
