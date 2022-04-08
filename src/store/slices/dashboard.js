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
    },
    seriesreplace: {
        weekly: [
            {
                name: 'Memberships',
                data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
            },
            {
                name: 'Packages',
                data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
            },
            {
                name: 'Single',
                data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
            },
            {
                name: 'Retail',
                data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
            }
        ],
        monthly: [
            {
                name: 'Memberships',
                data: [900, 1000, 2000, 3000, 350, 800, 350, 200, 350, 450, 150, 750]
            },
            {
                name: 'Packages',
                data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
            },
            {
                name: 'Single',
                data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
            },
            {
                name: 'Retail',
                data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
            }
        ],
        annually: [
            {
                name: 'Memberships',
                data: [3500, 12500, 3500, 35, 35, 80]
            },
            {
                name: 'Packages',
                data: [35, 15, 15, 35, 65, 40, 80]
            },
            {
                name: 'Single',
                data: [35, 145, 35, 35, 20, 105, 100]
            },
            {
                name: 'Retail',
                data: [0, 0, 75, 0, 0, 115, 0]
            }
        ]
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
            state.xaxis = action.payload;
        },

        // ADD SALES REVENUE GROWTH DATA
        addSalesRevenueGrowthData(state, action) {
            state.seriesreplace = action.payload;
        }
    }
});

// Reducer
export default dashboard.reducer;
export const { addRevenueDataToDashboard, hasError, addSalesRevenueGrowthData, addXAxisDataToDashboard } = dashboard.actions;

// ----------------------------------------------------------------------
