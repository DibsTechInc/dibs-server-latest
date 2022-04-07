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
            value: '$-',
            up: 1,
            comparedwith: 'yesterday',
            percentage: 0
        },
        {
            label: 'THIS WEEK',
            value: '$-',
            up: 1,
            comparedwith: 'last week',
            percentage: 0
        },
        {
            label: 'THIS MONTH',
            value: '$-',
            up: 1,
            comparedwith: 'last month',
            percentage: 0
        },
        {
            label: 'THIS YEAR',
            value: '$-',
            up: 1,
            comparedwith: 'last year',
            percentage: 0
        }
    ],
    xaxis: {
        monthly: {
            xaxiscategories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        weekly: {
            xaxiscategories: ['1', '2', '3', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        annually: {
            xaxiscategories: ['2022', '2021', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
    }
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
        },

        // ADD AXIS DATA
        addXAxisDataToDashboard(state, action) {
            console.log(`addXAxisDataToDashboard action.payload is: ${JSON.stringify(action.payload)}`);
            state.xaxis = action.payload;
        }
    }
});

// Reducer
export default dashboard.reducer;
export const { addRevenueDataToDashboard, hasError, addXAxisDataToDashboard } = dashboard.actions;

// ----------------------------------------------------------------------
