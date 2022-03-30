'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('revenue_reference', "serviceID", { type: Sequelize.INTEGER })
      .then(() => {
        let query = `UPDATE revenue_reference
                     SET "serviceID" = attendees."serviceID"
                     FROM attendees
                     WHERE revenue_reference."studioID" = attendees."studioID"
                       AND revenue_reference."paymentCategory" = attendees."serviceName";`
        queryInterface.sequelize.query(query).spread((results, metadata) => {});
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('revenue_reference', "serviceID");
  }
};
