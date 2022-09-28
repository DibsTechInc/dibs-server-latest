const fs = require('fs-extra');
/**
 * Reads a .sql file for it's query, and uglifies it for querying.
 * @param  {string} pathAndFilename path and name of file to read
 * @return {string}                 the parsed string
 */
function sqlQueryReader(pathAndFilename) {
    const rawQuery = fs.readFileSync(pathAndFilename, 'utf8');
    const uglyQuery = rawQuery
        .split('\n')
        .map((q) => q.trim())
        .filter((q) => !q.match('--'))
        .join(' ');
    return uglyQuery;
}

module.exports = sqlQueryReader;
