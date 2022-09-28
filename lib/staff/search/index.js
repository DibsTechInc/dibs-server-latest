
const _ = require('lodash');

/**
 * @param {string} lookupTable table we are searching for the query string in
 * @param {string} tsQuery query string
 * @param {number} length max number of entries returned
 * @returns {string} sql query for search
 */
function query(lookupTable, tsQuery, length) {

  console.log('data from query search');
  console.log(tsQuery);
  console.log('');
  console.log('lookuptable');
  console.log(lookupTable);

  return `
    SELECT id, "firstname", "lastname", email
    FROM dibs_studio_instructors
    WHERE to_tsquery(${tsQuery}) @@ ft_search
    AND id in (SELECT id FROM ${lookupTable} WHERE dibs_studio_id = $dibsStudioId)
    AND "deletedAt" is NULL
    AND enabled is TRUE
    ORDER BY lastname, firstname ASC
    LIMIT ${length};`;
}

/**
 *
 * @param {string} searchString search query
 * @param {number} dibsStudioId studio searching
 * @returns {array} sorted list of matches
 */
module.exports = async function instructorSearchFindAndSort(searchString, dibsStudioId, { maxLength = 10 } = {}) {
  // try exact match first
  const stringSplit = searchString.split(' ');
  const stringToConcat = stringSplit.map(s => s.concat(' &'));
  const tsQuery = `quote_literal('${stringToConcat}')`;
  const options = {
    model: models.dibs_studio_instructor,
    type: models.sequelize.QueryTypes.SELECT,
    bind: {
      searchString,
      dibsStudioId,
    },
  };
  const [ instructorMatches ] = await Promise.all([
    models.sequelize.query(query('dibs_studio_instructor', tsQuery, maxLength), options),
  ]);

  const combinedMatches = _([...instructorMatches]).uniqBy('id').valueOf();
  let sortedMatches = combinedMatches.sort((a, b) => a.firstname - b.firstname);

  // if no results just search the old way
  if (!sortedMatches.length) {
    const tsQuery2 = searchString.split(' ')
      .map((word, i) => {
        const str = `quote_literal(quote_literal('${word}')) || ':*'`;
        return i < 1 ? `${str}` : `|| ' & ' || ${str}`;
      }).join('');
    const options2 = {
      model: models.dibs_studio_instructor,
      type: models.sequelize.QueryTypes.SELECT,
      bind: {
        searchString,
        dibsStudioId,
      },
    };
    const [ userMatches2 ] = await Promise.all([
      models.sequelize.query(query('dibs_studio_instructors', tsQuery2, maxLength), options2),
      // models.sequelize.query(query('attendees', tsQuery2, maxLength), options2),
    ]);

    const combinedMatches2 = _([...userMatches2]).uniqBy('id').valueOf();
    sortedMatches = combinedMatches2.sort((a, b) => a.firstname - b.firstname);
  }
  return sortedMatches.slice(0, maxLength);
};
