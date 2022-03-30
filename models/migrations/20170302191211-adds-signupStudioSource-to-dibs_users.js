'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'signupStudioSource', {
      type: Sequelize.STRING(4),
    })
    .then(() => {
      let query = 'UPDATE dibs_users ';
      query += `SET "signupStudioSource" = 'zf', `;
      query += `"signupStudioId" = SUBSTRING("signupStudioId" FROM 2) `;
      query += `WHERE "signupStudioId" IS NOT NULL `
      query += `AND SUBSTRING("signupStudioId" FROM 1 FOR 1) = 'z';`;
      return queryInterface.sequelize.query(query);
    })
    .then(() => {
      let query = 'UPDATE dibs_users ';
      query += `SET "signupStudioSource" = 'mb' `;
      query += `WHERE "signupStudioId" IS NOT NULL `;
      query += `AND "signupStudioSource" IS NULL;`;
      return queryInterface.sequelize.query(query);
    })
    .then(() => queryInterface.sequelize.query('ALTER TABLE dibs_users ALTER COLUMN "signupStudioId" TYPE INTEGER USING "signupStudioId"::INTEGER'));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'signupStudioId', {
      type: Sequelize.TEXT,
    })
    .then(() => {
      let query = 'UPDATE dibs_users ';
      query += `SET "signupStudioId" = 'z' || "signupStudioId" `;
      query += `WHERE "signupStudioId" IS NOT NULL `
      query += `AND "signupStudioSource" = 'zf';`;
      return queryInterface.sequelize.query(query);
    })
    .then(() => queryInterface.removeColumn('dibs_users', 'signupStudioSource'));
  }
};
