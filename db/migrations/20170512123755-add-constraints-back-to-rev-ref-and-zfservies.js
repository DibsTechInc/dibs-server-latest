'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('revenue_reference', ['studioID', 'serviceID'], { unique: true })
    .then(() =>
      queryInterface.sequelize.query("ALTER TABLE zf_services ADD PRIMARY KEY (id, studioid)")
    )
  },
  down: function (queryInterface, Sequelize) {
    return  queryInterface.sequelize.query('DROP INDEX public.revenue_reference_studio_i_d_service_i_d CASCADE;')
    .then(() =>
       queryInterface.sequelize.query("ALTER TABLE public.zf_services DROP CONSTRAINT zf_services_pkey;")
    );
  }
};
