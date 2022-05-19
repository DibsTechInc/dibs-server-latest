// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    products: []
};

const retail = createSlice({
    name: 'retail',
    initialState,
    reducers: {
        // HAS ERROR
        hasError: (state, action) => {
            state.error = action.payload;
        },
        // ADD PRODUCTS IN STUDIO ADMIN
        setRetailProducts: (state, action) => {
            state.products = action.payload;
        }
    }
});

// Reducer
export default retail.reducer;
export const { setRetailProducts, hasError } = retail.actions;

// ----------------------------------------------------------------------
