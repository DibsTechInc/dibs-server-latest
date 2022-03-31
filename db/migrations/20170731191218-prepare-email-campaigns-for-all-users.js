'use strict';
const Promise = require('bluebird');
const models = require('../');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return models.dibs_user.findAll().then(users =>
      Promise.each(users, user => models.email_campaign.create({ userid: user.id }))
    )
  },

  down: function (queryInterface, Sequelize) {
    return models.email_campaign.destroy();
  }
};
