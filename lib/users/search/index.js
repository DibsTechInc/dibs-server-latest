
const _ = require('lodash');

/**
 * @param {string} lookupTable table we are searching for the query string in
 * @param {string} tsQuery query string
 * @param {number} length max number of entries returned
 * @returns {string} sql query for search
 */
function query(lookupTable, tsQuery, length) {
  return `
    SELECT id, "pictureUrl", "firstName", "lastName", email,
    rank_user_matches($searchString, dibs_users.*) as rank
    FROM dibs_users
    WHERE to_tsquery(${tsQuery}) @@ ft_search
    AND id in (SELECT userid FROM ${lookupTable} WHERE dibs_studio_id = $dibsStudioId)
    AND "deletedAt" is NULL
    ORDER BY rank DESC, "lastAccessedAt" DESC
    LIMIT ${length};`;
}

/**
 *
 * @param {string} searchString search query
 * @param {number} dibsStudioId studio searching
 * @returns {array} sorted list of matches
 */
module.exports = async function clientSearchFindAndSort(searchString, dibsStudioId, { maxLength = 10 } = {}) {
  // try exact match first
  const stringSplit = searchString.split(' ');
  const stringToConcat = stringSplit.map(s => s.concat(' &'));
  const tsQuery = `quote_literal('${stringToConcat}')`;
  const options = {
    model: models.dibs_user,
    type: models.sequelize.QueryTypes.SELECT,
    bind: {
      searchString,
      dibsStudioId,
    },
  };
  const [userMatches, attendeeMatches] = await Promise.all([
    models.sequelize.query(query('dibs_user_studios', tsQuery, maxLength), options),
    models.sequelize.query(query('attendees', tsQuery, maxLength), options),
  ]);

  const combinedMatches = _([...userMatches, ...attendeeMatches]).uniqBy('id').valueOf();
  let sortedMatches = combinedMatches.sort((a, b) => b.rank - a.rank);

  // if no results just search the old way
  if (!sortedMatches.length) {
    const tsQuery2 = searchString.split(' ')
      .map((word, i) => {
        const str = `quote_literal(quote_literal('${word}')) || ':*'`;
        return i < 1 ? `${str}` : `|| ' & ' || ${str}`;
      }).join('');
    const options2 = {
      model: models.dibs_user,
      type: models.sequelize.QueryTypes.SELECT,
      bind: {
        searchString,
        dibsStudioId,
      },
    };
    const [userMatches2, attendeeMatches2] = await Promise.all([
      models.sequelize.query(query('dibs_user_studios', tsQuery2, maxLength), options2),
      models.sequelize.query(query('attendees', tsQuery2, maxLength), options2),
    ]);

    const combinedMatches2 = _([...userMatches2, ...attendeeMatches2]).uniqBy('id').valueOf();
    sortedMatches = combinedMatches2.sort((a, b) => b.rank - a.rank);
  }
  return sortedMatches.slice(0, maxLength);
};
