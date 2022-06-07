import { useState } from 'react';
import { useSelector, useDispatch } from 'store';
import { setNumDaysToShowCalendar } from 'store/slices/dibsstudio';
import { Grid, Typography, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// import actions
import updateCalendarInterval from 'actions/studios/settings/updateCalendarIntervalSettings';

const WidgetChangeTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:before:hover': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: '#c96248'
    }
});

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL -> DAYS TO SHOW ON CALENDAR ||============================== //

const DaysToShowCalendar = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [hasError, setHasError] = useState(false);
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { studioConfig, config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    // eslint-disable-next-line camelcase
    const { interval_end } = studioConfig;
    const [numDays, setNumDays] = useState(interval_end);
    const [madeNumDaysBlank, setMadeNumDaysBlank] = useState(false);
    const [isEditingNumDays, setIsEditingNumDays] = useState(false);
    const studioMessage = `Set the number of days that your clients can book in advance. The default # of days is 14.`;
    const editNumDays = () => {
        setIsEditingNumDays(!isEditingNumDays);
    };
    const handleNumDaysFocus = () => {
        if (!madeNumDaysBlank) {
            setNumDays('');
            setMadeNumDaysBlank(true);
        }
    };
    const handleCancelNumDaysChange = () => {
        setIsEditingNumDays(false);
        setNumDays(interval_end);
        setHasError(false);
        setErrorMessage('');
        setMadeNumDaysBlank(false);
    };
    const handleNumDaysChange = (e) => {
        console.log(`changing numDays to: ${e.target.value}`);
        setNumDays(e.target.value);
    };
    const clickedNumDays = () => {
        setIsEditingNumDays(!isEditingNumDays);
    };
    const handleSubmit = async () => {
        try {
            const newInterval = parseInt(numDays, 10);
            if (newInterval > 0) {
                const res = await updateCalendarInterval(dibsStudioId, newInterval);
                if (res.msg === 'success') {
                    setHasSuccess(true);
                    setSuccessMessage(`Successfully updated the number of days to show on the calendar.`);
                    setHasError(false);
                    setErrorMessage('');
                    setIsEditingNumDays(false);
                    dispatch(setNumDaysToShowCalendar(newInterval));
                    setTimeout(() => {
                        setHasSuccess(false);
                        setSuccessMessage('');
                    }, 7000);
                    setMadeNumDaysBlank(false);
                } else {
                    setHasError(true);
                    setErrorMessage(res.error);
                    setMadeNumDaysBlank(false);
                    setHasSuccess(false);
                    setSuccessMessage('');
                    setTimeout(() => {
                        setHasError(false);
                    }, 7000);
                }
                setMadeNumDaysBlank(false);
            } else {
                setHasError(true);
                setHasSuccess(false);
                setErrorMessage('You must enter an integer as the number of days. Please try again.');
                setMadeNumDaysBlank(false);
                setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                return null;
            }
        } catch (error) {
            setHasError(true);
            setHasSuccess(false);
            setErrorMessage('You must enter an integer as the number of days. Please try again.');
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            setMadeNumDaysBlank(false);
            return null;
        }
        console.log(`now will set interval end to numdays`);
        return null;
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {studioMessage}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2.2 }}>
                <Grid container>
                    {hasError && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Typography>
                        </Grid>
                    )}
                    {hasSuccess && (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.success.dark }}>
                                {successMessage}
                            </Typography>
                        </Grid>
                    )}
                    {isEditingNumDays ? (
                        <WidgetChangeTextField
                            variant="standard"
                            onChange={(e) => handleNumDaysChange(e)}
                            onFocus={() => handleNumDaysFocus()}
                            sx={{ width: '30px' }}
                            value={numDays}
                        />
                    ) : (
                        <Grid item onClick={clickedNumDays}>
                            {numDays} days
                        </Grid>
                    )}
                </Grid>
            </Grid>
            {!isEditingNumDays && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Button onClick={editNumDays}>Edit</Button>
                    </Grid>
                </Grid>
            )}
            {isEditingNumDays && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item>
                        <Button
                            onClick={handleCancelNumDaysChange}
                            sx={{
                                bgcolor: theme.palette.globalcolors.cancel,
                                '&:hover': {
                                    backgroundColor: theme.palette.globalcolors.hover
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disableElevation
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{
                                bgcolor: theme.palette.globalcolors.submit,
                                '&:hover': {
                                    backgroundColor: theme.palette.globalcolors.hoverSubmit
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};
export default DaysToShowCalendar;
