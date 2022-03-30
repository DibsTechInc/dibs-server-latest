'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_transactions', 'retail_product_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'retail_products',
        key: 'id',
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_transactions', 'retail_product_id');
  }
};
