import axios from 'axios';
import { isEmpty } from 'lodash';
import { addError } from './ErrorActions';
/**
 * setSearchTerm
 * @param {string} term the new search term
 * @returns {Object} action on the state
 */
export function setSearchTerm(term) {
    return { type: SET_SEARCH_TERM, term };
}

/**
 * clearSearchTerms
 * @returns {Object} action on the state
 */
export function clearSearchTerms() {
    return { type: CLEAR_SEARCH_TERMS };
}

/**
 * addOrUpdateSearchResults
 * @param {String} term search to cache on
 * @param {Array<Object>} results of the search
 * @returns {Object} action on the state
 */
export function addOrUpdateSearchResults(term, results) {
    return { type: ADD_OR_UPDATE_SEARCH_RESULTS, term, results };
}

/**
 * clearSearchResults
 * @returns {Object} action on the state
 */
export function clearSearchResults() {
    return { type: CLEAR_SEARCH_RESULTS };
}

/**
 * Get search results for a query from server
 * @returns {function} redux thunk
 */
export function getSearchResults() {
    return async function innerGetSearchResults(dispatch, getState) {
        try {
            const state = getState();
            const term = getClientSearchTerm(state).trim();
            if (term && term.length > 0) {
                const cachedResult = getCachedClientSearchResult(state);
                if (!isEmpty(cachedResult)) {
                    return cachedResult;
                }
            }
            const { data } = await axios.get(`/studios/api/clients/search?searchString=${term}`);
            if (data.success) {
                return dispatch(addOrUpdateSearchResults(term, data.results));
            }
            return dispatch(addError('Something went wrong searching for clients'));
        } catch (err) {
            console.log(err);
            return dispatch(addError('Something went wrong searching for clients'));
        }
    };
}
/**
 *
 * @param {number} id user id
 * @returns {Promise} axios put request
 */
export function updateRecentSearches(id) {
    return async function innerUpdateRecentSearches() {
        return axios.put('/studios/api/clients/search/add-to-recents', { id });
    };
}
