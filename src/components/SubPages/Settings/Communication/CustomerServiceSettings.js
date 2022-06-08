import React from 'react';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Stack, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import validator from 'email-validator';
import { useSelector, useDispatch } from 'store';

import updateGeneralLocationSettings from 'actions/studios/settings/updateGeneralLocationSettings';
import { setGeneralLocationData } from 'store/slices/dibsstudio';

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

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const CustomerServiceSettings = () => {
    const theme = useTheme();
    const { config, customerService } = useSelector((state) => state.dibsstudio);
    const dispatch = useDispatch();
    const { dibsStudioId } = config;
    const { customerServiceEmail, customerServicePhone } = customerService;
    const [isEditing, setIsEditing] = React.useState(false);
    const [error, setError] = React.useState('');
    const [email, setEmail] = React.useState(customerServiceEmail);
    // const [phoneAsNumber, setPhoneAsNumber] = React.useState(customerServicePhone);
    const [hasError, setHasError] = React.useState(false);
    const [hasSuccessMsg, setHasSuccessMsg] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState('');
    const [madeEmailBlank, setMadeEmailBlank] = React.useState(false);
    const [madePhoneBlank, setMadePhoneBlank] = React.useState(false);
    const number = phoneUtil.parseAndKeepRawInput(customerServicePhone, 'US');
    const labelphone = phoneUtil.format(number, PNF.NATIONAL);
    const [phone, setPhone] = React.useState(labelphone);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };
    const handleEmailFocus = () => {
        if (!madeEmailBlank) {
            setEmail('');
            setMadeEmailBlank(true);
        }
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        // setPhoneAsNumber(e.target.value);
    };
    const handlePhoneFocus = () => {
        if (!madePhoneBlank) {
            setPhone('');
            setMadePhoneBlank(true);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        setHasError(false);
        setPhone(labelphone);
        // setPhoneAsNumber(customerServicePhone);
        setEmail(customerServiceEmail);
        setMadePhoneBlank(false);
        setMadeEmailBlank(false);
    };
    const handleSubmit = async () => {
        setMadeEmailBlank(false);
        setMadePhoneBlank(false);
        // check if email is valid
        const isValidEmail = validator.validate(email);
        if (!isValidEmail) {
            setError(`The email address you entered doesn't seem to be valid. Can you try again?`);
            setHasError(true);
            setMadeEmailBlank(false);
            setEmail(customerServiceEmail);
            setTimeout(() => {
                setHasError(false);
                setError('');
            }, 7000);
            return null;
        }
        const testnumber = phone.replace(/\D/g, '');
        // const numbertest = phoneUtil.parseAndKeepRawInput(phone, 'US');
        // console.log(`numbertest: ${numbertest}`);
        let validphone = true;
        // if letters in phone number - throw an error
        try {
            const numbertotest = phoneUtil.parseAndKeepRawInput(testnumber, 'US');
            validphone = phoneUtil.isValidNumber(numbertotest);
        } catch (err) {
            setError(`The phone number you entered doesn't seem to be valid. Can you try again?`);
            setHasError(true);
            setMadePhoneBlank(false);
            setPhone(labelphone);
            // setPhoneAsNumber(customerServicePhone);
            setTimeout(() => {
                setHasError(false);
                setError('');
            }, 7000);
        }
        if (!validphone) {
            setError(`The phone number you entered doesn't seem to be valid. Can you try again?`);
            setHasError(true);
            setMadePhoneBlank(false);
            setPhone(labelphone);
            setTimeout(() => {
                setHasError(false);
                setError('');
            }, 7000);
            return null;
        }
        const res = await updateGeneralLocationSettings(dibsStudioId, email, testnumber);
        if (res.msg === 'success') {
            setSuccessMsg(`Successfully updated the customer service email and phone number.`);
            setHasSuccessMsg(true);
            setIsEditing(false);
            const formatnumber = phoneUtil.parseAndKeepRawInput(testnumber, 'US');
            const postSuccessNumber = phoneUtil.format(formatnumber, PNF.NATIONAL);
            setPhone(postSuccessNumber);
            setTimeout(() => {
                setHasSuccessMsg(false);
                setSuccessMsg('');
            }, 7000);
            const ld = { serviceEmail: email, servicePhone: testnumber };
            dispatch(setGeneralLocationData(ld));
        } else {
            setError(res.error);
            setMadePhoneBlank(false);
            setMadeEmailBlank(false);
            setTimeout(() => {
                setHasError(false);
                setError('');
            }, 7000);
        }
        // setIsEditing(false);
        return null;
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    Enter the email address and phone number that your clients should use if they have customer service inquiries.
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
                    <Grid item xs={4} sx={{ mr: 3 }}>
                        <Typography variant="h6">Email</Typography>
                        {isEditing ? (
                            <CommunicationTextField
                                variant="standard"
                                onChange={(e) => handleEmailChange(e)}
                                onFocus={() => handleEmailFocus()}
                                sx={{ width: '220px' }}
                                value={email}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {email}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h6">Phone #</Typography>
                        {isEditing ? (
                            <CommunicationTextField
                                variant="standard"
                                onFocus={() => handlePhoneFocus()}
                                onChange={(e) => handlePhoneChange(e)}
                                sx={{ width: '150px' }}
                                value={phone}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {phone}
                            </Typography>
                        )}
                    </Grid>
                </Stack>
            </Grid>
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
        </Grid>
    );
};

// CustomerServiceSettings.propTypes = {
//     minp: PropTypes.number,
//     maxp: PropTypes.number
// };

export default CustomerServiceSettings;
