const models = require('@dibs-tech/models');
const _ = require('lodash');
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

/**
 * @param {string} lookupTable table we are searching for the query string in
 * @param {string} tsQuery query string
 * @param {number} length max number of entries returned
 * @returns {string} sql query for search
 */
function query(lookupTable, tsQuery, length, dibsStudioId, searchTerm) {
    return `
    SELECT id, "firstName", "lastName", email, "mobilephone",
    rank_user_matches('${searchTerm}', dibs_users.*) as rank
    FROM dibs_users
    WHERE to_tsquery(${tsQuery}) @@ ft_search
    AND id in (SELECT userid FROM ${lookupTable} WHERE dibs_studio_id = ${dibsStudioId})
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
module.exports = async function getClientSearchResults(req, res, { maxLength = 60 } = {}) {
    // try exact match first
    // const searchString = decodeURIComponent(req.query.searchString);
    let newSortedMatches;
    try {
        const { dibsStudioId, searchTerm } = req.body;
        const stringSplit = searchTerm.split(' ');
        const stringToConcat = stringSplit.map((s) => s.concat(' &'));
        const tsQuery = `quote_literal('${stringToConcat}')`;
        const options = {
            model: models.dibs_user,
            type: models.sequelize.QueryTypes.SELECT,
            bind: {
                searchTerm,
                dibsStudioId
            }
        };
        const [userMatches, attendeeMatches] = await Promise.all([
            models.sequelize.query(query('dibs_user_studios', tsQuery, maxLength, dibsStudioId, searchTerm), options),
            models.sequelize.query(query('attendees', tsQuery, maxLength, dibsStudioId, searchTerm), options)
        ]);
        const combinedMatches = _([...userMatches, ...attendeeMatches])
            .uniqBy('id')
            .valueOf();
        let sortedMatches = combinedMatches.sort((a, b) => b.rank - a.rank);
        // if no results just search the old way
        if (!sortedMatches.length) {
            const tsQuery2 = searchTerm
                .split(' ')
                .map((word, i) => {
                    const str = `quote_literal(quote_literal('${word}')) || ':*'`;
                    console.log(`string is: ${str}`);
                    return i < 1 ? `${str}` : `|| ' & ' || ${str}`;
                })
                .join('');
            const options2 = {
                model: models.dibs_user,
                type: models.sequelize.QueryTypes.SELECT,
                bind: {
                    searchTerm,
                    dibsStudioId
                }
            };
            const [userMatches2, attendeeMatches2] = await Promise.all([
                models.sequelize.query(query('dibs_user_studios', tsQuery2, maxLength, dibsStudioId, searchTerm), options2),
                models.sequelize.query(query('attendees', tsQuery2, maxLength, dibsStudioId, searchTerm), options2)
            ]);
            const combinedMatches2 = _([...userMatches2, ...attendeeMatches2])
                .uniqBy('id')
                .valueOf();
            sortedMatches = combinedMatches2.sort((a, b) => b.rank - a.rank);
        }
        newSortedMatches = sortedMatches.map((item) => {
            const newFirstName = item.firstName;
            const newLastName = item.lastName;
            let labelfirstname;
            let labellastname;
            try {
                labelfirstname = newFirstName[0].toUpperCase() + newFirstName.substring(1);
                labellastname = newLastName[0].toUpperCase() + newLastName.substring(1);
            } catch (err) {
                console.log('error setting the last name of this user', item.id, item.email);
                labelfirstname = item.firstName;
                labellastname = item.lastName;
            }
            let labelphone;
            if (item.mobilephone) {
                try {
                    const number = phoneUtil.parseAndKeepRawInput(item.mobilephone, 'US');
                    // labelphone = phoneUtil.formatInOriginalFormat(number, 'US');
                    // labelphone = phoneUtil.formatOutOfCountryCallingNumber(number, 'US');
                    labelphone = phoneUtil.format(number, PNF.NATIONAL);
                } catch (err) {
                    labelphone = 'No Phone';
                    console.log(`had trouble parsing phone number: ${err}`);
                }
            } else {
                labelphone = 'No Phone';
            }
            return {
                key: item.id,
                label: `${labelfirstname} ${labellastname}`,
                id: item.id,
                firstName: item.firstName,
                lastName: item.lastName,
                email: item.email,
                phonelabel: labelphone,
                phone: item.mobilephone,
                rank: item.rank
            };
        });
        console.log(`newSortedmatches after the change is: ${JSON.stringify(newSortedMatches)}`);
        if (!newSortedMatches) {
            console.log('there are no other matches');
            res.json({
                msg: 'no more matches',
                newSortedMatches: [],
                matchestoreturn: 0
            });
        }
        res.json({
            msg: 'success',
            newSortedMatches,
            matchestoreturn: newSortedMatches.length
        });
    } catch (err) {
        console.log(`error getting search results for client search. Error is: ${err}`);
        return err;
    }
    return { msg: 'failure', moreinfo: 'no results' };
};
