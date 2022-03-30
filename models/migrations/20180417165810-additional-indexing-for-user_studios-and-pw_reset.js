'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('password_resets', ['uuidParam'], { method: 'BTREE', unique: true })
    await queryInterface.addIndex('dibs_user_studios', ['dibs_studio_id', 'userid'], { unique: true }).catch((err) => {console.log(err); throw err})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('password_resets', ['uuidParam'])
    await queryInterface.removeIndex('dibs_user_studios', ['dibs_studio_id', 'userid'])
  }
};
