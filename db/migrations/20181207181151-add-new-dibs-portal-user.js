'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dibs_portal_users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: Sequelize.STRING,
      mobilephone: Sequelize.STRING,
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      password: Sequelize.TEXT,
      push_token: Sequelize.STRING,
      invite_code_redeemed: Sequelize.STRING,
      invite_code_to_refer: Sequelize.STRING,
      venmo_name: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addColumn('credits', 'dibs_portal_userid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    });
    await queryInterface.addColumn('flash_credits', 'dibs_portal_userid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('flash_credits', 'dibs_portal_userid');
    await queryInterface.removeColumn('credits', 'dibs_portal_userid');
    await queryInterface.dropTable('dibs_portal_users');
  },
};
