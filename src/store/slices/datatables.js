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
        data: {},
        needsRefresh: false
    },
    reporting: {
        title: '',
        headers: {},
        data: {},
        summary: {},
        csvData: {},
        needsRefresh: false
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
        },
        setPromoNeedsRefresh(state, action) {
            state.promocodes.needsRefresh = action.payload;
        },
        setReportingDataForTable(state, action) {
            state.reporting.data = action.payload;
        },
        setSummaryForTable(state, action) {
            state.reporting.summary = action.payload;
        },
        setCsvDataForTable(state, action) {
            state.reporting.csvData = action.payload;
        }
    }
});

// Reducer
export default datatables.reducer;
export const {
    addPromoCodeHeaders,
    addPromoCodeData,
    setPromoNeedsRefresh,
    setCsvDataForTable,
    setReportingDataForTable,
    setSummaryForTable
} = datatables.actions;

// ----------------------------------------------------------------------
