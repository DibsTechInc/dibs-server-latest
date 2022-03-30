'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => 
      Promise.all([
        queryInterface.addColumn('events', 'zf_series_types', Sequelize.JSONB, { transaction }),
        queryInterface.addColumn('studio_packages', 'zf_series_type_id', Sequelize.STRING, { transaction }),
      ])
    );
     
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.removeColumn('events', 'zf_series_types',{ transaction }),
        queryInterface.removeColumn('studio_packages', 'zf_series_type_id', { transaction }),
      ])
    );
  }
};
