// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';
// import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const initialState = {
    config: {
        id: 0,
        dibsStudioId: 0,
        accountType: 'studio-admin',
        userEmail: '',
        role: 'admin',
        firstname: '',
        lastname: '',
        financialAccess: false,
        settingsAccess: false
    },
    customerService: {
        customerServiceEmail: '',
        customerServicePhone: ''
    },
    settings: {
        dynamicPricing: false,
        flashCredits: false,
        minPrice: 20,
        maxPrice: 30
    },
    integrations: {
        classpass: false,
        gymPass: false
    }
};

const dibsstudio = createSlice({
    name: 'dibsstudio',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        // ADD STUDIO DATA
        addStudioData(state, action) {
            state.config = action.payload;
        },
        setClasspass(state, action) {
            state.integrations.classpass = action.payload;
        },
        setDynamicPricing(state, action) {
            state.settings.dynamicPricing = action.payload;
        },
        setFlashCreditsStore(state, action) {
            state.settings.flashCredits = action.payload;
        },
        setGympass(state, action) {
            state.integrations.gympass = action.payload;
        },
        setGlobalPrices(state, action) {
            console.log(`setGlobalPrices action is: ${JSON.stringify(action.payload)}`);
            console.log(`action.payload.minPrice is: ${action.payload.minPrice}`);
            state.settings.minPrice = action.payload.minPrice;
            state.settings.maxPrice = action.payload.maxPrice;
        },
        setGeneralLocationData(state, action) {
            console.log(`setGeneralLocationData action is: ${JSON.stringify(action.payload)}`);
            state.customerService.customerServiceEmail = action.payload.serviceEmail;
            state.customerService.customerServicePhone = action.payload.servicePhone;
        }
    }
});

// Reducer
export default dibsstudio.reducer;
export const {
    addStudioData,
    hasError,
    setClasspass,
    setGympass,
    setDynamicPricing,
    setFlashCreditsStore,
    setGlobalPrices,
    setGeneralLocationData
} = dibsstudio.actions;

// ----------------------------------------------------------------------
