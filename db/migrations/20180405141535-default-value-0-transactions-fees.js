'use strict';
const models = require('../');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const updateAttr = attr => `UPDATE dibs_transactions SET ${attr} = 0 WHERE ${attr} IS NULL`;
    await queryInterface.sequelize.query(updateAttr('tax_amount'));
    // tax_amount
    await queryInterface.changeColumn('dibs_transactions', 'tax_amount', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    // stripe_fee
    await queryInterface.sequelize.query(updateAttr('stripe_fee'));
    await queryInterface.changeColumn('dibs_transactions', 'stripe_fee', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    // dibs_fee
    await queryInterface.sequelize.query(updateAttr('dibs_fee'));
    await queryInterface.changeColumn('dibs_transactions', 'dibs_fee', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    // studio_payment
    await queryInterface.sequelize.query(updateAttr('studio_payment'));
    await queryInterface.changeColumn('dibs_transactions', 'studio_payment', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    // tax_withheld
    await queryInterface.sequelize.query(updateAttr('tax_withheld'));
    await queryInterface.changeColumn('dibs_transactions', 'tax_withheld', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    return null;
  },

  down: async (queryInterface, Sequelize) => {
    // tax_amount
    await queryInterface.changeColumn('dibs_transactions', 'tax_amount', {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
    });
    // stripe_fee
    await queryInterface.changeColumn('dibs_transactions', 'stripe_fee', {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
    });
    // dibs_fee
    await queryInterface.changeColumn('dibs_transactions', 'dibs_fee', {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
    });
    // studio_payment
    await queryInterface.changeColumn('dibs_transactions', 'studio_payment', {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
    });
    // tax_withheld
    await queryInterface.changeColumn('dibs_transactions', 'tax_withheld', {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
    });
    return null;
  },
};
