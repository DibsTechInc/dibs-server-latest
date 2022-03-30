'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
            .removeIndex('my_studios', ['source', 'studioid'])
            .then(() =>
              queryInterface.addIndex('my_studios', ['dibs_studio_id', 'userid', 'source', 'studioid'], { unique: true })
            );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface
            .removeIndex('my_studios', ['dibs_studio_id', 'userid', 'source', 'studioid'])
            .then(() =>
              queryInterface.addIndex('my_studios', ['source', 'studioid'], { unique: true })
            );
  }
};
