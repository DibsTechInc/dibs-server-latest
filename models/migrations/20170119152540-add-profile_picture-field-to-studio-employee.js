'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_employees', 'profile_picture', {
      type: Sequelize.STRING,
      defaultValue: '//d1f9yoxjfza91b.cloudfront.net/dibs-user-placeholder.png',
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_employees', 'profile_picture')

  }
};
