// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';
// import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const initialState = {
    isEditingCreditCardViaStripe: false,
    needToGetCardInfoFromStripe: false
};

const actionstatus = createSlice({
    name: 'actionstatus',
    initialState,
    reducers: {
        setIsEditingCreditCardRedux(state, action) {
            state.isEditingCreditCardViaStripe = action.payload;
        },
        setNeedToGetCardInfoFromStripeRedux(state, action) {
            state.needToGetCardInfoFromStripe = action.payload;
        }
    }
});

// Reducer
export default actionstatus.reducer;
export const { setIsEditingCreditCardRedux, setNeedToGetCardInfoFromStripeRedux } = actionstatus.actions;

// ----------------------------------------------------------------------
