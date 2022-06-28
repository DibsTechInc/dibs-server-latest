// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';
// import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const initialState = {
    promocodes: {
        headers: {},
        data: {}
    }
};

const datatables = createSlice({
    name: 'datatables',
    initialState,
    reducers: {
        // ADD STUDIO DATA
        addPromoCodeHeaders(state, action) {
            state.promocodes.headers = action.payload;
        },
        addPromoCodeData(state, action) {
            state.promocodes.data = action.payload;
        }
    }
});

// Reducer
export default datatables.reducer;
export const { addPromoCodeHeaders, addPromoCodeData } = datatables.actions;

// ----------------------------------------------------------------------
