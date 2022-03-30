'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('dibs_studios', 'zf_reporting_id', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'zf_reporting_secret', Sequelize.STRING),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('dibs_studios', 'zf_reporting_id'),
      queryInterface.removeColumn('dibs_studios', 'zf_reporting_secret'),
    ])
  }
};
