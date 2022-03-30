'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn('dibs_configs', 'high_value_spend_threshold', {
     type: Sequelize.FLOAT,
     defaultValue: 120,
   });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_configs', 'high_value_spend_threshold')
  }
};
