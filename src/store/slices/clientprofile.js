// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    currentuser: {
        userid: 0,
        name: '',
        email: '',
        stripeid: ''
    }
};

const clientprofile = createSlice({
    name: 'clientprofile',
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
            state.yearstoshow = action.payload;
        },

        // ADD SALES REVENUE GROWTH DATA
        addSalesRevenueGrowthData(state, action) {
            state.seriesreplace = action.payload;
        }
    }
});

// Reducer
export default clientprofile.reducer;
export const { addRevenueDataToDashboard, hasError, addSalesRevenueGrowthData, addXAxisDataToDashboard, setNumYearsToShow } =
    clientprofile.actions;

// ----------------------------------------------------------------------
