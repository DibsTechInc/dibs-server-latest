'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'pike13_clientid', {
      type: Sequelize.STRING
    }).then(() => queryInterface.addColumn('dibs_studios', 'pike13_secret', {
      type: Sequelize.STRING
    }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.remove('dibs_studios', 'pike13_clientid')
    .then(() => queryInterface.remove('dibs_studios', 'pike13_secret'))
  }
};
