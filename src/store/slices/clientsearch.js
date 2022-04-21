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
            state.term = action.payload;
        },
        clearSearchTerms: (state) => {
            state.term = '';
        },
        addOrUpdateSearchResults: (state, action) => {
            state.results.matches = action.payload;
        },
        addToRecentsSearch: (state, action) => {
            const array = [];
            array.push(action.payload);
            const existingArray = state.results.recents;
            const findkey = existingArray.find((element) => element.key === array[0].key);
            if (!findkey) {
                state.results.recents.unshift(action.payload);
            }
        },
        clearSearchResults: (state) => {
            state.results.matches = {};
        }
    }
});

export default clientsearch.reducer;
export const { setSearchTerm, clearSearchTerms, addOrUpdateSearchResults, clearSearchResults, addToRecentsSearch } = clientsearch.actions;
