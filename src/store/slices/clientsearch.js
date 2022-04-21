import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    term: '',
    results: {
        recents: [],
        matches: []
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
            console.log(`action.payload sent to add or update search results is: ${JSON.stringify(action)}`);
            // const { term, results } = action.payload;
            // state.results = [action.term.length > 0 ? action.term : action.results;
            state.results.matches = action.payload;
        },
        addToRecentsSearch: (state, action) => {
            console.log(`addToRecentsSearch REDUCER: ${JSON.stringify(action.payload)}`);
            state.results.recents.push(action.payload[0]);
        },
        clearSearchResults: (state) => {
            state.results.matches = {};
        }
    }
});

export default clientsearch.reducer;
export const { setSearchTerm, clearSearchTerms, addOrUpdateSearchResults, clearSearchResults, addToRecentsSearch } = clientsearch.actions;
