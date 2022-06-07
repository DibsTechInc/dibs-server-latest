import { useState } from 'react';
import { useSelector, useDispatch } from 'store';
import { setStudioCancelTime } from 'store/slices/dibsstudio';
import { Grid, Typography, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// import actions
import updateCancelTimeSettings from 'actions/studios/settings/updateCancelTimeSettings';

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

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL -> CANCELATION ||============================== //

const CancelationSetting = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [hasError, setHasError] = useState(false);
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { studioConfig, config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    // eslint-disable-next-line camelcase
    const { cancelTime } = studioConfig;
    const [cancelTimePage, setCancelTimePage] = useState(cancelTime);
    const [madeCancelTimeBlank, setMadeCancelTimeBlank] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const studioMessage = `Set the cancelation window here. If a client cancels outside of the cancelation window, they will not be penalized. The default cancelation window is 12 hours.`;
    const editAmount = () => {
        setIsEditing(!isEditing);
    };
    const handleFocus = () => {
        if (!madeCancelTimeBlank) {
            setCancelTimePage('');
            setMadeCancelTimeBlank(true);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        setCancelTimePage(cancelTime);
        setHasError(false);
        setErrorMessage('');
        setMadeCancelTimeBlank(false);
    };
    const handleChange = (e) => {
        console.log(`changing to: ${e.target.value}`);
        setCancelTimePage(e.target.value);
    };
    const clickedInput = () => {
        setIsEditing(!isEditing);
    };
    const handleSubmit = async () => {
        try {
            const timeToSend = parseInt(cancelTimePage, 10);
            if (timeToSend > 0) {
                const res = await updateCancelTimeSettings(dibsStudioId, timeToSend);
                if (res.msg === 'success') {
                    setHasSuccess(true);
                    setSuccessMessage(`Successfully updated the cancelation window.`);
                    setHasError(false);
                    setErrorMessage('');
                    setIsEditing(false);
                    dispatch(setStudioCancelTime(timeToSend));
                    setTimeout(() => {
                        setHasSuccess(false);
                        setSuccessMessage('');
                    }, 7000);
                    setMadeCancelTimeBlank(false);
                } else {
                    setHasError(true);
                    setErrorMessage(res.error);
                    setMadeCancelTimeBlank(false);
                    setHasSuccess(false);
                    setSuccessMessage('');
                    setTimeout(() => {
                        setHasError(false);
                    }, 7000);
                }
                setMadeCancelTimeBlank(false);
            } else {
                setHasError(true);
                setHasSuccess(false);
                setErrorMessage('You must enter an integer as the number of hours for the cancelation window. Please try again.');
                setMadeCancelTimeBlank(false);
                setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                return null;
            }
        } catch (error) {
            setHasError(true);
            setHasSuccess(false);
            setErrorMessage('You must enter an integer as the award amount. Please try again.');
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            setMadeCancelTimeBlank(false);
            return null;
        }
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
                    {isEditing ? (
                        <WidgetChangeTextField
                            variant="standard"
                            onChange={(e) => handleChange(e)}
                            onFocus={() => handleFocus()}
                            sx={{ width: '30px' }}
                            value={cancelTimePage}
                        />
                    ) : (
                        <Grid item onClick={clickedInput}>
                            {cancelTimePage} hours
                        </Grid>
                    )}
                </Grid>
            </Grid>
            {!isEditing && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Button onClick={editAmount}>Edit</Button>
                    </Grid>
                </Grid>
            )}
            {isEditing && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item>
                        <Button
                            onClick={handleCancel}
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
export default CancelationSetting;
