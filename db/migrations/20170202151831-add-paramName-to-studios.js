'use strict';
const models = require('../')
const DibsStudio = models.dibs_studio;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
            .addColumn('dibs_studios', 'paramName', { type: Sequelize.STRING })
            .then(() => {
              return DibsStudio.findAll();
            })
            .then(studios => {
              const updateMap = studios.map(studio => studio.update({ paramName: studio.getParamName() }))
              return Promise.all(updateMap);
            })
            .then(() => console.log('done'))
            .catch(err => console.log(err));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface
            .removeColumn('dibs_studios', 'paramName')
  }
};
