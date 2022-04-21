import axios from 'axios';
// ==============================|| GET DASHBOARD DATA ||============================== //

export const getNewSearchResults = async (dibsStudioId, searchTerm) => {
    try {
        console.log(`dibsStudioId is: ${dibsStudioId} and searchTerm is: ${searchTerm}`);
        const response = await axios.post('/api/get-client-search-results', {
            dibsStudioId,
            searchTerm
        });
        if (response.data.msg === 'success' && response.data.matchestoreturn > 0) return response.data.newSortedMatches;
        return 0;
    } catch (err) {
        console.log(`error getting search results for client search. Error is: ${err}`);
    }
    return 0;
};

export default getNewSearchResults;
