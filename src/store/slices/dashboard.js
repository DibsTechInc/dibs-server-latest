// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    revenuetotals: [
        {
            label: 'TODAY',
            value: '$0',
            up: 1,
            comparedwith: 'yesterday',
            percentage: 0
        },
        {
            label: 'THIS WEEK',
            value: '$0',
            up: 1,
            comparedwith: 'last week',
            percentage: 0
        },
        {
            label: 'THIS MONTH',
            value: '$0',
            up: 1,
            comparedwith: 'last month',
            percentage: 0
        },
        {
            label: 'THIS YEAR',
            value: '$0',
            up: 1,
            comparedwith: 'last year',
            percentage: 0
        }
    ]
};

const dashboard = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // ADD REVENUE DATA
        addRevenueDataToDashboard(state, action) {
            state.revenuetotals = action.payload.revenuetotals;
        }
    }
});

// Reducer
export default dashboard.reducer;
export const { addRevenueDataToDashboard, hasError } = dashboard.actions;

// ----------------------------------------------------------------------
