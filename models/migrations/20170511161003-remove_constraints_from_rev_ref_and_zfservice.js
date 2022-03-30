'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('DROP INDEX public.revenue_reference_service_i_d_studio_i_d CASCADE;')
    .then(() =>
      queryInterface.sequelize.query('DROP INDEX public.revenue_reference_studio_i_d_service_i_d CASCADE;')
    ).then(() =>
       queryInterface.sequelize.query("ALTER TABLE public.zf_services DROP CONSTRAINT zf_services_pkey;")
    ).then(() =>
      queryInterface.sequelize.query('DROP INDEX public.zf_services_studioid_name CASCADE;')
  );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('revenue_reference', ['studioID', 'serviceID'], { unique: true })
    .then(() =>
      queryInterface.sequelize.query("ALTER TABLE zf_services ADD PRIMARY KEY (id, studioid)")
    ).then(() =>
      queryInterface.addIndex('zf_services', ['studioid', 'name'])
    ).then(() => queryInterface.addIndex('revenue_reference', ['serviceID', 'studioID'], { unique: true }));
    }
};
