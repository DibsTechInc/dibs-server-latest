'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'flow_xo_attributes', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'flow_xo_attributes'); 
  }
};
