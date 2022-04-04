// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    revenuetotals: [
        {
            label: 'TODAY',
            value: '$28',
            up: 1,
            comparedwith: 'yesterday',
            percentage: 32
        },
        {
            label: 'THIS WEEK',
            value: '$872',
            up: 1,
            comparedwith: 'last week',
            percentage: 32
        },
        {
            label: 'THIS MONTH',
            value: '$999',
            up: 1,
            comparedwith: 'last month',
            percentage: 32
        },
        {
            label: 'THIS YEAR',
            value: '$12,789',
            up: 1,
            comparedwith: 'last year',
            percentage: 32
        }
    ]
};

const slice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // ADD REVENU DATA
        addRevenueDataToDashboard(state, action) {
            state.revenuetotals = action.payload.revenuetotals;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getDashboardRevenue() {
    return async () => {
        const valuesToSeed = {
            todayrevenue: 25,
            weekrevenue: 187,
            monthrevenue: 782,
            yearrevenue: 12828
        };
        try {
            // const response = await axios.get('/api/kanban/columns');
            dispatch(slice.actions.addRevenueDataToDashboard(valuesToSeed));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
