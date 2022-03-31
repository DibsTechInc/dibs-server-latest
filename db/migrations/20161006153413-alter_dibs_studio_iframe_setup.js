'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_studios', 'iframes', {type: Sequelize.TEXT}).then(() =>
      queryInterface.renameColumn('dibs_studios', 'iframes', 'iframe')
    )

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_studios', 'iframes', 'iframe').then(() =>
      queryInterface.changeColumn('dibs_studios', 'iframes', {type: Sequelize.JSONB})
    )

  }
};
