// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    events: []
};

const calendar = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET EVENTS
        getEventsSuccess(state, action) {
            state.events = action.payload;
        },

        // ADD EVENT
        addEventSuccess(state, action) {
            state.events = action.payload;
        },

        // UPDATE EVENT
        updateEventSuccess(state, action) {
            state.events = action.payload;
        },

        // REMOVE EVENT
        removeEventSuccess(state, action) {
            state.events = action.payload;
        }
    }
});

// Reducer
export default calendar.reducer;

// ----------------------------------------------------------------------

export function getEvents(dibsStudioId) {
    return async () => {
        try {
            const response = await axios.post('/api/studio/calendar/events', { dibsid: dibsStudioId });
            console.log(`response from getcalendar events is: ${JSON.stringify(response.data)}`);
            const { data } = response;
            dispatch(calendar.actions.getEventsSuccess(data.classEvents));
        } catch (error) {
            dispatch(calendar.actions.hasError(error));
        }
    };
}

export function addEvent(event) {
    return async () => {
        try {
            const response = await axios.post('/api/calendar/events/new', event);
            dispatch(calendar.actions.addEventSuccess(response.data));
        } catch (error) {
            dispatch(calendar.actions.hasError(error));
        }
    };
}

export function updateEvent(event) {
    return async () => {
        try {
            const response = await axios.post('/api/calendar/events/update', event);
            dispatch(calendar.actions.updateEventSuccess(response.data.events));
        } catch (error) {
            dispatch(calendar.actions.hasError(error));
        }
    };
}

export function removeEvent(eventId) {
    return async () => {
        try {
            const response = await axios.post('/api/calendar/events/remove', { eventId });
            dispatch(calendar.actions.removeEventSuccess(response.data));
        } catch (error) {
            dispatch(calendar.actions.hasError(error));
        }
    };
}
