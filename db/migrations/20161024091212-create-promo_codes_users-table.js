'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('promo_codes_users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id'
        }
      },
      promoid:{
        type: Sequelize.INTEGER,
        references: {
            model: 'promo_codes',
            key: 'id'
          }
      },
      studioid: {
        type: Sequelize.INTEGER
      },
      source: {
        type: Sequelize.STRING(4)
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    }).then(() =>
      queryInterface.addIndex('promo_codes_users', ['studioid', 'source'])
    )

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('promo_codes_users')
  }
};
