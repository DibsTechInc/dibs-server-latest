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
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Packages',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Singles',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Retail',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Gift Cards',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ],
        monthly: [
            {
                name: 'Memberships',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Packages',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Singles',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Retail',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Gift Cards',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ],
        annually: [
            {
                name: 'Memberships',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Packages',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Singles',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Retail',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Gift Cards',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ]
    },
    yearstoshow: 8
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

        // SET YEARS TO SHOW
        setNumYearsToShow(state, action) {
            console.log(`setting num years to show to ${action.payload}`);
            state.yearstoshow = action.payload;
        },

        // ADD SALES REVENUE GROWTH DATA
        addSalesRevenueGrowthData(state, action) {
            console.log(`action.payload for Sales Revenue Growth Data is: ${JSON.stringify(action.payload)}`);
            state.seriesreplace = action.payload;
            console.log(`just set the values to payload again`);
        }
    }
});

// Reducer
export default dashboard.reducer;
export const { addRevenueDataToDashboard, hasError, addSalesRevenueGrowthData, addXAxisDataToDashboard, setNumYearsToShow } =
    dashboard.actions;

// ----------------------------------------------------------------------
