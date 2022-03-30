'use strict';

const moment = require('moment');
const timestamp = moment.utc().format()
const initialData = [
  {
    id: 1,
    source: 'zf',
    studioid: 2,
    locationid: 1,
    min_price: 21,
    max_price: 26,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 2,
    source: 'zf',
    studioid: 2,
    locationid: 2,
    min_price: 21,
    max_price: 26,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 3,
    source: 'zf',
    studioid: 3,
    locationid: 1,
    min_price: 19,
    max_price: 25,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 4,
    source: 'zf',
    studioid: 3,
    locationid: 2,
    min_price: 18,
    max_price: 25,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 5,
    source: 'mb',
    studioid: 146718,
    locationid: 1,
    min_price: 20,
    max_price: 35,
    cp_problem: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 6,
    source: 'mb',
    studioid: 146718,
    locationid: 2,
    min_price: 20,
    max_price: 35,
    cp_problem: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 7,
    source: 'mb',
    studioid: 146718,
    locationid: 3,
    min_price: 20,
    max_price: 35,
    cp_problem: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 8,
    source: 'mb',
    studioid: 191638,
    locationid: 1,
    min_price: 15,
    max_price: 24,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 9,
    source: 'mb',
    studioid: 20456,
    locationid: 1,
    min_price: 21,
    max_price: 38,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 10,
    source: 'mb',
    studioid: 20456,
    locationid: 2,
    min_price: 21,
    max_price: 38,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 11,
    source: 'mb',
    studioid: 44507,
    locationid: 1,
    min_price: 19,
    max_price: 32,
    cp_problem: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 12,
    source: 'mb',
    studioid: 23340,
    locationid: 1,
    min_price: 19,
    max_price: 33,
    cp_problem: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 13,
    source: 'mb',
    studioid: 313625,
    locationid: 1,
    min_price: 15,
    max_price: 28,
    cp_problem: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 14,
    source: 'mb',
    studioid: 133880,
    locationid: 1,
    min_price: 12,
    max_price: 21,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 15,
    source: 'mb',
    studioid: 42169,
    locationid: 1,
    min_price: 19,
    max_price: 28,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 16,
    source: 'mb',
    studioid: 287274,
    locationid: 1,
    min_price: 17,
    max_price: 28,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 17,
    source: 'mb',
    studioid: 25068,
    locationid: 1,
    min_price: 17,
    max_price: 25,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 18,
    source: 'mb',
    studioid: 25068,
    locationid: 2,
    min_price: 17,
    max_price: 25,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, {
    id: 19,
    source: 'mb',
    studioid: 223993,
    locationid: 1,
    min_price: 17,
    max_price: 25,
    cp_problem: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
];

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('studio_pricings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      source: {
        type: Sequelize.STRING(4)
      },
      studioid: {
        type: Sequelize.INTEGER
      },
      locationid: {
        type: Sequelize.INTEGER
      },
      min_price: {
        type: Sequelize.FLOAT
      },
      max_price: {
        type: Sequelize.FLOAT
      },
      cp_problem: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then( () =>
      queryInterface.addIndex('studio_pricings', ['source', 'studioid', 'locationid'], {unique: true})
                    .then( () =>
                      queryInterface.bulkInsert('studio_pricings', initialData)
                    )
                  )
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('studio_pricings')
  }
};
