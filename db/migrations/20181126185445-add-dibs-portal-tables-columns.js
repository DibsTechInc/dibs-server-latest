'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invite_codes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id',
        },
      },
      code: {
        type: Sequelize.STRING,
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addColumn('dibs_users', 'invite_code_to_refer', {
      type: Sequelize.INTEGER,
      references: {
        model: 'invite_codes',
        key: 'id',
      },
    });
    await queryInterface.addColumn('dibs_users', 'invite_code_redeemed', {
      type: Sequelize.INTEGER,
      references: {
        model: 'invite_codes',
        key: 'id',
      },
    });
    await queryInterface.createTable('dibs_brands', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      logo_url: {
        type: Sequelize.STRING,
      },
      img_url: {
        type: Sequelize.STRING,
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
    return queryInterface.addColumn('flash_credits', 'dibs_brand_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_brands',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dibs_users', 'invite_code_to_refer');
    await queryInterface.removeColumn('dibs_users', 'invite_code_redeemed');
    await queryInterface.removeColumn('flash_credits', 'dibs_brand_id');
    await queryInterface.dropTable('invite_codes');
    return queryInterface.dropTable('dibs_brands');
  },
};
