'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "attendeeID" TYPE VARCHAR USING "attendeeID"::VARCHAR;');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "attendeeID" TYPE VARCHAR(30) USING "attendeeID"::VARCHAR(30);');
  }
};
