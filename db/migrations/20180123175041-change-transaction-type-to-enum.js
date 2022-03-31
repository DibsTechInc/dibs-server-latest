'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('dibs_transactions', 'type', {
      type: Sequelize.ENUM,
      values: ['class', 'cred', 'ccred', 'gift', 'chrty', 'wait', 'pack'],
      allowNull: true,
    })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.changeColumn('dibs_transactions', 'type', { type: Sequelize.STRING(5) });
  }
};
