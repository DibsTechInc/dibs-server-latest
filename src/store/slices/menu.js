import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    openItem: ['dashboard'],
    drawerOpen: false,
    clientprofilemenu: 0
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.openItem = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        },

        setClientProfileMenu(state, action) {
            state.clientprofilemenu = action.payload;
        }
    }
});

export default menu.reducer;

export const { activeItem, openDrawer, setClientProfileMenu } = menu.actions;
