import * as React from 'react';
import { useSelector } from 'store';
import moment from 'moment-timezone';
import propTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function BasicDatePicker(props) {
    const [value, setValue] = React.useState(null);
    const { studioConfig } = useSelector((state) => state.dibsstudio);
    const { timeZone } = studioConfig;
    const date = new Date();
    date.setDate(date.getDate());
    const { setDate, type } = props;
    const setDateForDatabase = (date) => {
        if (type === 'start') {
            const datetouse = moment(date).tz(timeZone);
            setDate(moment(datetouse).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'));
        } else {
            const datetouse = moment(date).tz(timeZone);
            setDate(moment(datetouse).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'));
        }
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                value={value}
                // components={{
                //     OpenPickerIcon: CalendarMonthIcon
                // }}
                onChange={(newValue) => {
                    setValue(newValue);
                    setDateForDatabase(newValue);
                }}
                maxDate={date}
                renderInput={(params) => <TextField {...params} helperText={null} />}
                InputProps={{
                    sx: {
                        '& .MuiSvgIcon-root': { color: '#e7b2a5' },
                        '& .MuiOutlinedInput-input': { py: '5px', px: '8px', width: '80px' }
                    }
                }}
            />
        </LocalizationProvider>
    );
}
BasicDatePicker.propTypes = {
    setDate: propTypes.func,
    type: propTypes.string
};
