'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('dibs_studios', ['studioid', 'source'], { unique: true })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('dibs_studios', ['studioid', 'source'])
  }
};
