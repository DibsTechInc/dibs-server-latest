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
            console.log(`setClasspass - action.payload is: ${JSON.stringify(action.payload)}`);
            state.integrations.classpass = action.payload;
        },
        setGympass(state, action) {
            state.integrations.gympass = action.payload;
        }
    }
});

// Reducer
export default dibsstudio.reducer;
export const { addStudioData, hasError, setClasspass, setGympass } = dibsstudio.actions;

// ----------------------------------------------------------------------
