'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE attendees ALTER COLUMN "serviceID" TYPE BIGINT USING "serviceID"::BIGINT')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE attendees ALTER COLUMN "serviceID" TYPE VARCHAR USING "serviceID"::VARCHAR')

  }
};
