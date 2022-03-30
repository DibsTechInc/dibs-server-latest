'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('passes', 'dibs_autopay_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_user_autopay_packages',
        key: 'id',
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE passes DROP CONSTRAINT dibs_autopay_id_foreign_idx;')
  }
};
