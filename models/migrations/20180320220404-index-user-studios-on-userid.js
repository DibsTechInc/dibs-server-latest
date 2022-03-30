'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => Promise.all([
      queryInterface.addIndex('dibs_user_studios', ['userid'], {
        unique: false,
        transaction
      }),
      queryInterface.changeColumn('dibs_user_studios', 'userid', {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id'
        }
      }, { transaction })
    ]))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => Promise.all([
      queryInterface.removeIndex('dibs_user_studios', ['userid'], {
        transaction
      }),
      queryInterface.changeColumn('dibs_user_studios', 'userid', {
        type: Sequelize.INTEGER,
        
      }, { transaction })
    ]))
    }
};
