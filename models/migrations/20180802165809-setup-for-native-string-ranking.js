'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;')
    return queryInterface.sequelize.query(`CREATE FUNCTION rank_user_matches (comparsion varchar(255), entry dibs_users) RETURNS INTEGER
  AS $$
  BEGIN
    RETURN greatest(
     levenshtein(comparsion, entry."firstName"),
     levenshtein(comparsion, entry."lastName"),
     levenshtein(comparsion, entry."email"),
     levenshtein(comparsion, entry."firstName" || ' ' || entry."lastName"),
     levenshtein(comparsion, entry."firstName" || ' ' || entry."lastName" || ' ' || entry.email));
  END;
  $$
  LANGUAGE plpgsql;`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS fuzzystrmatch;')
    return queryInterface.sequelize.query('DROP FUNCTION rank_user_matches(comparsion varchar(255), entry dibs_users)')
  }
};
