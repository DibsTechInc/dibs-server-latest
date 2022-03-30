'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
  queryInterface.sequelize.query('ALTER TABLE events ADD CONSTRAINT studio_class UNIQUE USING INDEX studio_class_index');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query('ALTER TABLE events DROP CONSTRAINT IF EXISTS studio_class');
  }
};
