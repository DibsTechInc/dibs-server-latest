'use strict';
const models = require('../');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('friend_referrals', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
    await models.friend_referrals.update({ dibs_studio_id: 0}, { where: { dibs_studio_id: null } })
    await queryInterface.changeColumn('friend_referrals', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
    return null;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('friend_referrals', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
    await queryInterface.changeColumn('friend_referrals', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      defaultValue: null,
    })
    return null;
  }
};
