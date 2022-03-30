'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'onboardingDescription', Sequelize.STRING)
      .then(() => {
        [{
          name: 'Flex Studios',
          studioid: 1,
          onboardingDescription: 'Pilates, barre, TRX',
        }, {
          name: 'Mile High Run Club',
          studioid: 2,
          onboardingDescription: 'Running, strength and power training',
        }, {
          name: 'Row House',
          studioid: 5,
          onboardingDescription: 'Rowing, HIIT',
        }, {
          name: 'Studio 360',
          studioid: 10,
          onboardingDescription: 'Cycling, yoga, full body workout',
        }, {
          name: 'The Axle Workout',
          studioid: 15,
          onboardingDescription: 'Full body workout',
        }, {
          name: 'The Fit Co',
          studioid: 17,
          onboardingDescription: 'Pilates, yoga, cardio',
        }, {
          name: 'Throwback Fitness',
          studioid: 8,
          onboardingDescription: 'Full body workout with playground games',
        }, {
          name: 'Uplift',
          studioid: 11,
          onboardingDescription: 'Women only, cardio and strength',
        }, {
          name: 'Brooklyn Strength',
          studioid: 21,
          onboardingDescription: 'Pilates, strength and conditioning classes',
        }, {
          name: 'Torque Cycle + Strength',
          studioid: 18,
          onboardingDescription: 'Cycling, cardio, total body strength',
        }, {
          name: 'Core Collective',
          studioid: 4,
          onboardingDescription: 'HIIT, TRX, spin, yoga, pilates',
        }, {
          name: 'PHIIT London',
          studioid: 14,
          onboardingDescription: 'HIIT, pilates',
        }, {
          name: 'Studio Lagree UK',
          studioid: 19,
          onboardingDescription: 'Core, endurance, cardio, balance, strength, flexibility',
        }, {
          name: 'Studio One',
          studioid: 59,
          onboardingDescription: 'TRX, pilates, yoga, barre, boxing, pre/post natal',
        }, {
          name: 'Transition Zone',
          studioid: 26,
          onboardingDescription: 'Power plate, TRX, boxing, pilates, personal training',
        }].forEach(studio =>
          queryInterface.sequelize.query(`
            UPDATE dibs_studios
            SET "onboardingDescription" = '${studio.onboardingDescription}'
            WHERE dibs_studios.id = ${studio.studioid};
          `)
        )
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'onboardingDescription');
  }
};
