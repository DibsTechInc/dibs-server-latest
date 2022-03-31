'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    return queryInterface.sequelize.transaction(transaction => 
      Promise.all([
        queryInterface.addIndex('attendees', ['userid'], { unique: false, transaction }),
        queryInterface.addIndex('attendees', ['eventid'], { unique: false, transaction }),
        queryInterface.sequelize.query('CREATE INDEX attendee_email_idx ON attendees USING GIN (email gin_trgm_ops);', { transaction }),
      ])
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.removeIndex('attendees', ['userid'], { unique: false, transaction }),
        queryInterface.removeIndex('attendees', ['eventid'], { unique: false, transaction }),
        queryInterface.sequelize.query('DROP INDEX attendee_email_idx;', { transaction }),
      ])
    );
    return queryInterface.sequelize.query('DROP EXTENSION IF EXISTS pg_trgm;');
  }
};
