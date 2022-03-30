'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'mailing_address', 'mailing_address1')
      .then(() => queryInterface.addColumn('dibs_studios', 'mailing_address2', {
        type: Sequelize.STRING,
      }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'mailing_address2')
      .then(() => queryInterface.renameColumn('dibs_studios', 'mailing_address1', 'mailing_address'));
  }
};
