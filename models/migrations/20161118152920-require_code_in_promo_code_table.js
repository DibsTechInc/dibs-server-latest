'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('promo_codes', 'code', {type: Sequelize.STRING, allowNull: false})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('promo_codes', 'code', {type: Sequelize.STRING, allowNull: true})

  }
};
