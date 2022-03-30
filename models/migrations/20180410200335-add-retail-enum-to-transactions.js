'use strict';

const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'dibs_transactions',
      columnName: 'type',
      defaultValue: null,
      allowNull: true,
      newValues: ['class', 'cred', 'ccred', 'gift', 'chrty', 'wait', 'pack', 'raf', 'retail'],
      enumName: 'enum_dibs_transactions_type',
    });
  },

  down: (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'dibs_transactions',
      columnName: 'type',
      defaultValue: null,
      allowNull: true,
      newValues: ['class', 'cred', 'ccred', 'gift', 'chrty', 'wait', 'pack', 'raf'],
      enumName: 'enum_dibs_transactions_type',
    });
  }
};
