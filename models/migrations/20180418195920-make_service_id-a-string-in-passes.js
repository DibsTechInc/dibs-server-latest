'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('passes', 'source_serviceid', Sequelize.STRING).then(() => {
      return queryInterface.changeColumn('attendees','source_serviceid', Sequelize.STRING)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('passes', 'source_serviceid', Sequelize.INTEGER).then(() => {
      return queryInterface.changeColumn('attendees', 'source_serviceid', Sequelize.INTEGER)

    })
  }
};
