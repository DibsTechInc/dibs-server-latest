'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_configs', 'maximum_class_cart_quantity');
  },


  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_configs', 'maximum_class_cart_quantity', {
      type: Sequelize.INTEGER,
    });
  }
};
