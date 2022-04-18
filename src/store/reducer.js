// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import menuReducer from './slices/menu';
import dashboardReducer from './slices/dashboard';
import dibsstudioReducer from './slices/dibsstudio';
import clientprofileReducer from './slices/clientprofile';
import clientsearchReducer from './slices/clientsearch';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    // dibsstduio: persistReducer({ key: 'id', storage }, dibsstudioReducer),
    // dibsstudio: dibsstudioReducer,
    dibsstudio: persistReducer({ key: 'dibsstudio', storage, keyPrefix: 'dibsstudio-' }, dibsstudioReducer),
    // dashboard: dashboardReducer,
    dashboard: persistReducer({ key: 'dibsdashboard', storage, keyPrefix: 'dibsdashboard-' }, dashboardReducer),
    clientprofile: clientprofileReducer,
    clientsearch: clientsearchReducer,
    menu: menuReducer,
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'dibs-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer
});

export default reducer;
