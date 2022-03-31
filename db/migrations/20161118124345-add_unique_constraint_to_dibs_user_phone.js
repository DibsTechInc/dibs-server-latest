'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'mobilephone',
      {type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'mobilephone',
      {type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    })
  }
};
