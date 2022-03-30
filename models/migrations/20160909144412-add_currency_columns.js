'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('mb_studios', 'currency', Sequelize.STRING(3))
    .then(() => queryInterface.addColumn('zf_studios', 'currency', Sequelize.STRING(3)))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('mb_studios', 'currency')
    .then(() => queryInterface.removeColumn('zf_studios', 'currency'))
  }
};
