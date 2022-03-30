'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('mb_studios', 'cancel_time', Sequelize.INTEGER)
    .then(() => queryInterface.addColumn('zf_studios', 'cancel_time', Sequelize.INTEGER))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('mb_studios', 'cancel_time')
    .then(() => queryInterface.removeColumn('zf_studios', 'cancel_time'))
  }
};
