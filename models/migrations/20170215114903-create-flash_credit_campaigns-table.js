'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('flash_credit_campaigns', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id',
        },
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        },
      },
      email: Sequelize.STRING,
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      studio_name: Sequelize.STRING,
      expires: Sequelize.DATE,
      status: Sequelize.STRING,
      mth_avg: Sequelize.FLOAT,
      wk_avg: Sequelize.FLOAT,
      expires: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: Sequelize.DATE,
    }).then(() => queryInterface.addIndex('flash_credit_campaigns', ['source', 'studioid']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('flash_credit_campaigns', ['source', 'studioid'])
    .then(() => queryInterface.dropTable('flash_credit_campaigns'));
  }
};
