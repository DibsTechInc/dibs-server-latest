'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('credits', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: { model: 'dibs_studios', key: 'id' },
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('credits', 'dibs_studio_id')
  }
};
