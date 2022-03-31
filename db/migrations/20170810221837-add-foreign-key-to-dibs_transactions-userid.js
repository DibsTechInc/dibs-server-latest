'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('UPDATE dibs_transactions SET userid = NULL WHERE userid NOT IN (SELECT id FROM dibs_users)')
    .then(() => queryInterface.changeColumn('dibs_transactions', 'userid', {
      type: Sequelize.INTEGER,
      references: { model: 'dibs_users', key: 'id' },
    }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_transactions', 'userid', {
      type: Sequelize.INTEGER,
    });
  }
};
