'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_user_studios', 'created_by_employeeid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'studio_employees',
        key: 'id',
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_user_studios', 'created_by_employeeid')
  }
};
