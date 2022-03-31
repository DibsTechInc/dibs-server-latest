'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE dibs_studio_locations ALTER COLUMN latitude TYPE FLOAT USING (latitude::FLOAT);');
    return queryInterface.sequelize.query('ALTER TABLE dibs_studio_locations ALTER COLUMN longitude TYPE FLOAT USING (longitude::FLOAT);');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE dibs_studio_locations ALTER COLUMN latitude TYPE VARCHAR USING (latitude::VARCHAR);');
    return queryInterface.sequelize.query('ALTER TABLE dibs_studio_locations ALTER COLUMN longitude TYPE VARCHAR USING (longitude::VARCHAR);');
  }
};
