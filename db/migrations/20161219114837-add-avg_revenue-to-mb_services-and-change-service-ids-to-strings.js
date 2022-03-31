'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('mb_services', 'avg_revenue', Sequelize.FLOAT)
    .then(() =>
      queryInterface.sequelize.query('ALTER TABLE mb_services DROP CONSTRAINT mb_services_mbserviceid_mbstudioid_pk;')
    ).then(() =>
      queryInterface.changeColumn('mb_services', 'mbserviceid', Sequelize.STRING)
    ).then(() =>
      queryInterface.sequelize.query('ALTER TABLE mb_services ADD CONSTRAINT mb_services_mbserviceid_mbstudioid_pk PRIMARY KEY (mbstudioid, mbserviceid);')
    ).then(() =>
      queryInterface.changeColumn('attendees', 'serviceID', Sequelize.STRING)
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('mb_services', 'avg_revenue')
    .then(() =>
      queryInterface.sequelize.query('ALTER TABLE mb_services DROP CONSTRAINT mb_services_mbserviceid_mbstudioid_pk;')
    ).then(() =>
      queryInterface.sequelize.query('ALTER TABLE mb_services ALTER COLUMN mbserviceid TYPE BIGINT USING mbserviceid::BIGINT;')
    ).then(() =>
      queryInterface.sequelize.query('ALTER TABLE mb_services ADD CONSTRAINT mb_services_mbserviceid_mbstudioid_pk PRIMARY KEY (mbstudioid, mbserviceid);')
    ).then(() =>
      queryInterface.sequelize.query('ALTER TABLE attendees ALTER COLUMN "serviceID" TYPE INTEGER USING "serviceID"::INTEGER;')
    )
  }
};
