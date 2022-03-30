'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE INDEX user_email_idx ON dibs_users USING GIN (email gin_trgm_ops);');

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP INDEX user_email_idx CASCADE;');
  }
};
