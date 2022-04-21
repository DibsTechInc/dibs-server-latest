// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    profile: {
        // userid: 0,
        name: 'test'
        // stripeid: '',
        // phone: ''
    }
};

const currentclient = createSlice({
    name: 'currentclient',
    initialState,
    reducers: {
        // HAS ERROR
        hasError: (state, action) => {
            state.error = action.payload;
        },
        // ADD CURRENT CLIENT PROFILE IN STUDIO ADMIN
        setCurrentClientProfileStudioAdmin: (state, action) => {
            const { id, label } = action.payload;
            console.log(`CURRENT CLIENT REDUCER --> current client profile is: ${JSON.stringify(action.payload)}`);
            console.log(`value of userid is:`);
            console.log(state.profile.name);
            console.log(`id from payload is: ${label}`);
            state.profile.name = label;
            console.log(`made the update`);
            console.log(`state.profile.name is: ${state.profile.name}`);
            // state.userid = id;
            // state.email = action.payload.email;
            // state.phone = action.payload.labelphone;
        }
    }
});

// Reducer
export default currentclient.reducer;
export const { setCurrentClientProfileStudioAdmin, hasError } = currentclient.actions;

// ----------------------------------------------------------------------
