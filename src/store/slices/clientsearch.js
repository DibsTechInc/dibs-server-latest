import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    term: '',
    results: {
        recents: [],
        matches: {}
    }
};

const clientsearch = createSlice({
    name: 'clientsearch',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            console.log(`setSearchTerm: ${action.payload}`);
            state.term = action.payload;
        },
        clearSearchTerms: (state) => {
            state.term = '';
        },
        addOrUpdateSearchResults: (state, action) => {
            const { term, results } = action.payload;
            // state.results = [action.term.length > 0 ? action.term : action.results;
            state.results.matches[term] = results;
        },
        clearSearchResults: (state) => {
            state.results = {};
        }
    }
});

export default clientsearch.reducer;
export const { setSearchTerm, clearSearchTerms, addOrUpdateSearchResults, clearSearchResults } = clientsearch.actions;
