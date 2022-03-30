'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('passes', 'autopay', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
    .then(() => queryInterface.addColumn('passes', 'passValue', {
      type: Sequelize.FLOAT,
      allowNull: true,
    }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('passes', 'autopay')
      .then(() => queryInterface.removeColumn('passes', 'passValue'));
  },
};
