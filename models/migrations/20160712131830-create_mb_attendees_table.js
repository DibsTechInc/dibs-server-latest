'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('mb_attendees', {
      attendeeid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      eventid: Sequelize.INTEGER,
      mbuserid: Sequelize.INTEGER,
      status: Sequelize.INTEGER,
      deleted: Sequelize.INTEGER,
      source: Sequelize.STRING,
      description: Sequelize.TEXT,
      book_time: Sequelize.INTEGER,
      mbserviceid: Sequelize.INTEGER,
      dibs_category2: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
    })
    .then( () => queryInterface.addIndex('mb_attendees', ['deleted', 'mbuserid', 'eventid'], {indexName: 'deleted_user_event_index'}))
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('mb_attendees', 'deleted_user_event_index')
    .then( () => queryInterface.dropTable('mb_attendees'))
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
