'use strict';

const csvContent = `name,email
Aerospace NYC,info@aerospacenyc.com
Bari,tribeca@thebaristudio.com
Core Pilates,info@corepilatesnyc.com
CYC,info@cycfitness.com
DanceBody,info@dancebody.com
Exceed,kyle.parker6691@gmail.com
Flywheel,help@flywheelsports.com
Kore,info@korenewyork.com
Overthrow,john@overthrownyc.com
Physique 57,info@physique57.com
Pop Physique,hello@popphysique.com
Sky Ting Yoga,INFO@SKYTINGYOGA.COM
Swerve,flatiron@swervefitness.com
Y7 Studio,Rox@Y7-studio.com`

module.exports = {
  up: function (queryInterface, Sequelize) {
    const QUERY = csvContent.split('\n').slice(1).reduce((queryStr, row) => {
      const [name, email] = row.split(',');
      return `${queryStr}INSERT INTO studio_suggestions (name, email, times_suggested) VALUES ('${name}', '${email.toLowerCase()}', 0);\n`;
    }, '');
    return queryInterface.sequelize.query(QUERY);
  },

  down: function (queryInterface, Sequelize) {
    let QUERY = 'DELETE FROM studio_suggestions WHERE ';
    QUERY += csvContent.split('\n').slice(1).reduce((queryStr, row, i) => {
      const [name, email] = row.split(',');
      return `${queryStr}${i ? ' OR ' : ''} (name, email) = ('${name}', '${email.toLowerCase()}')`;
    }, '');
    return queryInterface.sequelize.query(QUERY);
  }
};
