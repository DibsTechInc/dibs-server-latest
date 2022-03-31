'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'address1', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
    .then(() => queryInterface.sequelize.query('UPDATE dibs_users SET address1 = address;'))
    .then(() => queryInterface.addColumn('dibs_users', 'address2', {
      type: Sequelize.TEXT,
      allowNull: true,
    }))
    .then(() => queryInterface.removeColumn('dibs_users', 'address'));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'address', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
    .then(() => queryInterface.sequelize.query('UPDATE dibs_users SET address = CASE WHEN address1 IS NULL THEN address2 ELSE address1 || COALESCE(address2, \'\') END;'))
    .then(() => queryInterface.removeColumn('dibs_users', 'address1'))
    .then(() => queryInterface.removeColumn('dibs_users', 'address2'));
  }
};
