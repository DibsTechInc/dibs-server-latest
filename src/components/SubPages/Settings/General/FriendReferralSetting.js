import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'store';
import { setRafAwardRedux } from 'store/slices/dibsstudio';
import { Grid, Typography, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// import actions
import updateRafAward from 'actions/studios/settings/updateRafAwardSettings';

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

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL -> FRIEND REFERRAL ||============================== //

const FriendReferralSetting = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [hasError, setHasError] = useState(false);
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { studioConfig, config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    // eslint-disable-next-line camelcase
    const { raf_award } = studioConfig;
    const [rafAward, setRafAward] = useState(raf_award);
    const [madeRafAwardBlank, setMadeRafAwardBlank] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [timeoutArray, setTimeoutArray] = useState([]);
    const studioMessage = `On Dibs, clients get rewarded when they refer friends. You can set the amount of the reward here. The default amount is $5.`;
    useEffect(
        () => () => {
            timeoutArray.forEach((timeout) => {
                clearTimeout(timeout);
            });
        },
        [timeoutArray]
    );
    const editRafAward = () => {
        setIsEditing(!isEditing);
    };
    const handleFocus = () => {
        if (!madeRafAwardBlank) {
            setRafAward('');
            setMadeRafAwardBlank(true);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        setRafAward(raf_award);
        setHasError(false);
        setErrorMessage('');
        setMadeRafAwardBlank(false);
    };
    const handleChange = (e) => {
        console.log(`changing to: ${e.target.value}`);
        setRafAward(e.target.value);
    };
    const clickedInput = () => {
        setIsEditing(!isEditing);
    };
    const handleSubmit = async () => {
        try {
            const newAward = rafAward.replace('$', '');
            const awardToSend = parseInt(newAward, 10);
            if (awardToSend > 0) {
                const res = await updateRafAward(dibsStudioId, awardToSend);
                if (res.msg === 'success') {
                    setHasSuccess(true);
                    setSuccessMessage(`Successfully updated the award amount.`);
                    setHasError(false);
                    setErrorMessage('');
                    setIsEditing(false);
                    dispatch(setRafAwardRedux(awardToSend));
                    const id = setTimeout(() => {
                        setHasSuccess(false);
                        setSuccessMessage('');
                    }, 7000);
                    setTimeoutArray([...timeoutArray, id]);
                    setMadeRafAwardBlank(false);
                } else {
                    setHasError(true);
                    setErrorMessage(res.error);
                    setMadeRafAwardBlank(false);
                    setHasSuccess(false);
                    setSuccessMessage('');
                    const id2 = setTimeout(() => {
                        setHasError(false);
                    }, 7000);
                    setTimeoutArray([...timeoutArray, id2]);
                }
                setMadeRafAwardBlank(false);
            } else {
                setHasError(true);
                setHasSuccess(false);
                setErrorMessage('You must enter an integer (without symbols) as the award amount. Please try again.');
                setMadeRafAwardBlank(false);
                const id3 = setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                setTimeoutArray([...timeoutArray, id3]);
                return null;
            }
        } catch (error) {
            setHasError(true);
            setHasSuccess(false);
            setErrorMessage('You must enter an integer as the award amount. Please try again.');
            const id4 = setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            setTimeoutArray([...timeoutArray, id4]);
            setMadeRafAwardBlank(false);
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
                            value={rafAward}
                        />
                    ) : (
                        <Grid item onClick={clickedInput}>
                            ${rafAward}
                        </Grid>
                    )}
                </Grid>
            </Grid>
            {!isEditing && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Button onClick={editRafAward}>Edit</Button>
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
export default FriendReferralSetting;
