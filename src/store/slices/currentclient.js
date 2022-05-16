// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    profile: {
        userid: 0,
        name: 'test',
        firstname: ''
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
            const { id, label, firstname } = action.payload;
            console.log(`state of the client profile name: ${state.profile.name}`);
            state.profile.name = label;
            state.profile.userid = id;
            if (firstname) {
                state.profile.firstname = firstname;
            }
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
