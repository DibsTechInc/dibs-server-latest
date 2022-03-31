'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('revenue_reference', 'source', Sequelize.STRING(4))
    .then(() => queryInterface.addColumn('revenue_reference', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: { model: 'dibs_studios', key: 'id' },
    }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('revenue_reference', 'source')
    .then(() => queryInterface.removeColumn('revenue_reference', 'dibs_studio_id'))
  }
};
