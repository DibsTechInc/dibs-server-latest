'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_user_autopay_packages', 'studio_package_id',  {
      type: Sequelize.INTEGER,
      references: {
        model: 'studio_packages',
        key: 'id',
      },
    })
    .then(() => queryInterface.removeColumn('dibs_user_autopay_packages', 'studio_packages_id'))
  },


  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_user_autopay_packages', 'studio_packages_id',  {
      type: Sequelize.INTEGER,
      references: {
        model: 'studio_packages',
        key: 'id',
      },
    })
    .then(() => queryInterface.removeColumn('dibs_user_autopay_packages', 'studio_package_id'));
  }
};
