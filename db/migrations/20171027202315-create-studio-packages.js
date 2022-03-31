'use strict';
const models = require('../');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('studio_packages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        },
      },
      name: Sequelize.STRING,
      classAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      price: Sequelize.FLOAT,
      autopay: {
        type: Sequelize.ENUM,
        values: Object.keys(models.studio_packages.AUTOPAY_OPTS).map((k) => models.studio_packages.AUTOPAY_OPTS[k]),
        defaultValue: models.studio_packages.AUTOPAY_OPTS.ALLOW,
      },
      priceAutopay: Sequelize.FLOAT,
      autopayIncrement: {
        type: Sequelize.ENUM,
        values: Object.keys(models.studio_packages.AUTOPAY_INCREMENTS).map((k) => models.studio_packages.AUTOPAY_INCREMENTS[k]),
        defaultValue: models.studio_packages.AUTOPAY_INCREMENTS.MONTH
      },
      autopayIncrementCount: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      stripe_plan_id: Sequelize.STRING,
      onlyFirstPurchase: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      passesValidFor: Sequelize.INTEGER,
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      deletedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('studio_packages', ['dibs_studio_id', 'price', 'classAmount']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('studio_packages', { force: true, cascade: true });
  }
};
