'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn('passes', 'source_serviceid', Sequelize.INTEGER)
  //  .then(() => 
  // //  queryInterface.addIndex('passes', ['dibs_studio_id', 'source_serviceid'], { unique: true })
  // )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('passes', ['dibs_studio_id', 'source_serviceid'])
    // .then(() => 
    //   // queryInterface.removeColumn('passes', 'source_serviceid', Sequelize.INTEGER)
    // )
  }
};
