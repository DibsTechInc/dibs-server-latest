import React from 'react';
import validator from 'email-validator';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Stack, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'store';

import { setCustomEmailToSendFrom } from 'store/slices/dibsstudio';
import UpdateSendingDomain from 'actions/studios/settings/updateSendingDomain';

const CommunicationTextField = styled(TextField)({
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

const CustomSendingDomain = () => {
    const theme = useTheme();
    const { config, customerService } = useSelector((state) => state.dibsstudio);
    const dispatch = useDispatch();
    const { dibsStudioId } = config;
    const { customEmailToSendFrom } = customerService;
    const [customEmail, setCustomEmail] = React.useState('hello@ondibs.com');
    const [isEditing, setIsEditing] = React.useState(false);
    const [error, setError] = React.useState('');
    const [hasError, setHasError] = React.useState(false);
    const [hasSuccessMsg, setHasSuccessMsg] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState('');
    const [doesHaveCustom, setDoesHaveCustom] = React.useState(false);
    const [madeCustomDomainBlank, setMadeCustomDomainBlank] = React.useState(false);
    let guidance = `Confirmation emails are being sent from the ${doesHaveCustom ? 'custom' : ''} email address listed below.`;
    const secondMsg = `Dibs can be configured to send confirmation emails from your own email domain (e.g. no-reply@yourbusiness.com). If you'd like to use your own domain, please contact us at studios@ondibs.com. We'll help you set up the configuration.`;
    if (!doesHaveCustom) guidance += ` ${secondMsg}`;
    const [timeoutArray, setTimeoutArray] = React.useState([]);

    React.useEffect(() => {
        if (customEmailToSendFrom !== null && customEmailToSendFrom.indexOf('ondibs') === -1) {
            setDoesHaveCustom(true);
            setCustomEmail(customEmailToSendFrom);
        }
        return () => {
            timeoutArray.forEach((timeout) => {
                clearTimeout(timeout);
            });
        };
    }, [customEmailToSendFrom, timeoutArray]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleDomainFocus = () => {
        if (!madeCustomDomainBlank) {
            setCustomEmail('');
            setMadeCustomDomainBlank(true);
        }
    };
    const handleDomainChange = (e) => {
        setCustomEmail(e.target.value);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setHasError(false);
        setHasSuccessMsg(false);
        setError('');
        setCustomEmail(customEmailToSendFrom);
        setMadeCustomDomainBlank(false);
    };
    const handleSubmit = async () => {
        setMadeCustomDomainBlank(false);
        const isValidEmail = validator.validate(customEmail);
        if (!isValidEmail) {
            setError(`The email address you entered doesn't seem to be valid. Can you try again?`);
            setHasError(true);
            const id = setTimeout(() => {
                setHasError(false);
                setError('');
            }, 7000);
            setTimeoutArray([...timeoutArray, id]);
            return null;
        }
        await UpdateSendingDomain(dibsStudioId, customEmail).then((res) => {
            if (res.msg === 'success') {
                setHasSuccessMsg(true);
                setSuccessMsg(`Your email address has been updated.`);
                const id = setTimeout(() => {
                    setHasSuccessMsg(false);
                    setSuccessMsg('');
                }, 7000);
                setTimeoutArray([...timeoutArray, id]);
                setIsEditing(false);
                setHasError(false);
                setError('');
                dispatch(setCustomEmailToSendFrom(customEmail));
            } else {
                setHasError(true);
                setError(`There was an error updating your email address. Please try again.`);
                const tid = setTimeout(() => {
                    setHasError(false);
                    setError('');
                }, 7000);
                setTimeoutArray([...timeoutArray, tid]);
            }
        });
        return null;
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {guidance}
                    <br />
                </Typography>
            </Grid>
            <Grid item xs={7} sx={{ mt: 4 }}>
                {hasError && (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    </Grid>
                )}
                {hasSuccessMsg && (
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mb: 2, color: theme.palette.success.dark }}>
                            {successMsg}
                        </Typography>
                    </Grid>
                )}
                <Stack direction="row" spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h6">Emails are being sent from:</Typography>
                        {isEditing ? (
                            <CommunicationTextField
                                variant="standard"
                                onChange={(e) => handleDomainChange(e)}
                                onFocus={() => handleDomainFocus()}
                                sx={{ width: '230px', mt: 2 }}
                                value={customEmail}
                            />
                        ) : (
                            <Typography variant="h7" sx={{ mt: 2 }}>
                                {customEmail}
                            </Typography>
                        )}
                    </Grid>
                </Stack>
            </Grid>
            {doesHaveCustom && (
                <Grid item xs={12} sx={{ mt: 4 }}>
                    {isEditing ? (
                        <Stack direction="row" spacing={3}>
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
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={handleCancel}
                                sx={{
                                    // color: '#fff',
                                    bgcolor: theme.palette.globalcolors.cancel,
                                    '&:hover': {
                                        backgroundColor: theme.palette.globalcolors.hover
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    ) : (
                        <Button disableElevation variant="contained" color="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                    )}
                </Grid>
            )}
        </Grid>
    );
};

export default CustomSendingDomain;
