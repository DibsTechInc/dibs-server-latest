'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('mb_services', ['mbstudioid', 'mbprogramid']).then(() =>
    queryInterface.changeColumn('mb_services', 'mbserviceid', {type: Sequelize.BIGINT})).then(() =>
      queryInterface.sequelize.query(`ALTER TABLE public.mb_services ADD CONSTRAINT mb_services_mbserviceid_mbstudioid_pk PRIMARY KEY (mbserviceid, mbstudioid);`))


  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('mb_services', ['mbstudioid', 'mbprogramid']).then(() =>
    queryInterface.sequelize.query(`ALTER TABLE public.mb_services DROP CONSTRAINT mb_services_mbserviceid_mbstudioid_pk;`)).then(() =>
      queryInterface.changeColumn('mb_services', 'mbserviceid', {type: Sequelize.INTEGER}))
  }
};
