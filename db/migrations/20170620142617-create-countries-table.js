'use strict';

const axios = require('axios');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('countries', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      code: {
        type: Sequelize.STRING(2),
      },
      region: {
        type: Sequelize.STRING,
      },
    })
    .then(() => axios.get('https://restcountries.eu/rest/v2/all'))
    .then(({ data }) => {
      const QUERY = data.reduce((queryStr, { alpha2Code, region }) => {
        return `${queryStr}INSERT INTO COUNTRIES (code, region) VALUES ('${alpha2Code}', '${region}');\n`;
      }, '');

      return queryInterface.sequelize.query(QUERY);
    })
    .then(() => queryInterface.addIndex('countries', ['code']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('countries');
  }
};
