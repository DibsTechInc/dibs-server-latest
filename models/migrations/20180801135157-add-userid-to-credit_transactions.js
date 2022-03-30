'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const query = col => queryInterface.sequelize.query(
      `UPDATE credit_transactions SET ${col} = (SELECT ${col} from credits WHERE credits.id = credit_transactions.creditid)`);
    await queryInterface.addColumn('credit_transactions', 'userid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    });
    await query('dibs_studio_id');
    return query('userid');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('credit_transactions', 'userid');
  }
};
