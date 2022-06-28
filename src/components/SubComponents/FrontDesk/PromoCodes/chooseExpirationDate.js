import * as React from 'react';
import moment from 'moment-timezone';
import propTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function BasicDatePicker(props) {
    const [value, setValue] = React.useState(null);
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const { setDate, setHasError, setErrorMessage } = props;
    const formatDate = (date) => moment(date).format('M/D/YYYY');
    const testError = (date) => {
        if (date < new Date()) {
            setHasError(true);
            setErrorMessage('The expiration date must be in the future. Please try again.');
        } else {
            setHasError(false);
            setErrorMessage('');
        }
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                value={value}
                onChange={(newValue) => {
                    testError(newValue);
                    setValue(newValue);
                    setDate(formatDate(newValue));
                }}
                sx={{ height: '30px' }}
                minDate={date}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}
BasicDatePicker.propTypes = {
    setDate: propTypes.func,
    setHasError: propTypes.func,
    setErrorMessage: propTypes.func
};
