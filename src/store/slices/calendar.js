// third-party
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

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
            // const response = await axios.get('/api/calendar/events');
            const { data } = response;
            const { classEvents } = data;
            await classEvents.map((event) => {
                console.log(`\n\n\nev in getEvents api call: ${JSON.stringify(event)}`);
                event.title = `${event.title} w/ ${event.instructor.firstname} (${event.spots_booked})`;
                event.description = `${event.spots_booked} spots booked`;
                event.start = moment.utc(event.start_date).format('YYYY-MM-DDTHH:mm:ssZ');
                event.end = moment.utc(event.end_date).format('YYYY-MM-DDTHH:mm:ssZ');
                if (event.private) {
                    event.backgroundColor = '#d3e2d5';
                }
                event.allDay = false;
                // event.start = moment.utc(event.start_date).utcOffset(0, true).format();
                console.log(`\n\n\nAfter changing it in getEvents api call: ${JSON.stringify(event)}`);
                return event;
            });
            // newEvents();
            dispatch(calendar.actions.getEventsSuccess(classEvents));
            console.log(`made the calendar dispatch call`);
        } catch (error) {
            console.log(`error is: ${JSON.stringify(error)}`);
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
