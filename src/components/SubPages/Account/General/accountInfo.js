import { useState, useEffect } from 'react';
import validator from 'email-validator';
import { getAuth, updateEmail } from 'firebase/auth';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { useSelector, useDispatch } from 'store';
import { capitalizeFirstLetter, allLowerCase } from 'helpers/general';
import { setStudioProfileAccountInfo } from 'store/slices/dibsstudio';
import UpdateStudioProfileAccount from 'actions/studios/account/updateStudioProfileAccount';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const AccountTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#ccc'
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
const auth = getAuth();

const AccountInfo = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { config } = useSelector((state) => state.dibsstudio);
    const { id, firstName, lastName, email, phone } = config;
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [emailValue, setEmailValue] = useState(email);
    const [firstNameValue, setFirstNameValue] = useState(firstName);
    const [lastNameValue, setLastNameValue] = useState(lastName);
    const [isEditing, setIsEditing] = useState(false);
    const [timeoutArray, setTimeoutArray] = useState([]);
    useEffect(
        () => () => {
            timeoutArray.forEach((timeout) => {
                clearTimeout(timeout);
            });
        },
        [timeoutArray]
    );
    let labelphone = '';
    if (phone && phone.length > 0) {
        const number = phoneUtil.parseAndKeepRawInput(phone, 'US');
        labelphone = phoneUtil.format(number, PNF.NATIONAL);
    }
    const [phoneValue, setPhoneValue] = useState(labelphone);
    const editAccountInfo = () => {
        setIsEditing(true);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setPhoneValue(phone);
        setEmailValue(email);
        setFirstNameValue(firstName);
        setLastNameValue(lastName);
    };
    const handleChange = (e) => {
        if (e.target.id === 'phone') setPhoneValue(e.target.value);
        if (e.target.id === 'email') setEmailValue(e.target.value);
        if (e.target.id === 'firstname') setFirstNameValue(e.target.value);
        if (e.target.id === 'lastname') setLastNameValue(e.target.value);
    };
    const handleSubmit = async () => {
        setHasError(false);
        setErrorMessage('');
        const isValidEmail = validator.validate(emailValue);
        if (!isValidEmail) {
            setHasError(true);
            setErrorMessage(`The email address you entered doesn't seem to be valid. Can you try again?`);
            const timeoutid = setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            setTimeoutArray([...timeoutArray, timeoutid]);
            return null;
        }
        if (phoneValue.length > 0) {
            const testnumber = phoneValue.replace(/\D/g, '');
            let validphone = true;
            try {
                const numbertotest = phoneUtil.parseAndKeepRawInput(testnumber, 'US');
                validphone = phoneUtil.isValidNumber(numbertotest);
            } catch (err) {
                setErrorMessage(`The phone number you entered doesn't seem to be valid. Can you try again?`);
                setHasError(true);
                setPhoneValue(labelphone);
                const timeoutid = setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                setTimeoutArray([...timeoutArray, timeoutid]);
                return null;
            }
            if (!validphone) {
                setErrorMessage(`The phone number you entered doesn't seem to be valid. Can you try again?`);
                setHasError(true);
                setPhoneValue(labelphone);
                const timeoutid = setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                setTimeoutArray([...timeoutArray, timeoutid]);
                return null;
            }
        }
        const newfirstname = capitalizeFirstLetter(firstNameValue);
        const newlastname = capitalizeFirstLetter(lastNameValue);
        const newemail = allLowerCase(emailValue);
        await UpdateStudioProfileAccount(id, newemail, newfirstname, newlastname, phoneValue).then((res) => {
            if (res.msg === 'success') {
                setHasSuccess(true);
                setSuccessMessage(`Your account information has been updated.`);
                const timeoutid = setTimeout(() => {
                    setHasSuccess(false);
                    setSuccessMessage('');
                }, 7000);
                setTimeoutArray([...timeoutArray, timeoutid]);
                setIsEditing(false);
                const datatosend = { email: newemail, firstName: newfirstname, lastName: newlastname, phone: phoneValue };
                setFirstNameValue(newfirstname);
                setLastNameValue(newlastname);
                setEmailValue(newemail);
                dispatch(setStudioProfileAccountInfo(datatosend));
                updateEmail(auth.currentUser, newemail)
                    .then(() => {
                        console.log(`email updated to ${newemail}`);
                    })
                    .catch((error) => {
                        console.log(`Error updating email: ${error}`);
                        setHasError(true);
                        setHasSuccess(false);
                        setErrorMessage(
                            `There was an error updating the authorization credentials associated with your email address. To address this issue, contact studios@ondibs.com and provide error code 66175.`
                        );
                        const timeoutId = setTimeout(() => {
                            setHasError(false);
                            setErrorMessage('');
                        }, 7000);
                        setTimeoutArray([...timeoutArray, timeoutId]);
                    });
            } else {
                setHasError(true);
                setErrorMessage(res.error);
                const tid = setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                setTimeoutArray([...timeoutArray, tid]);
            }
        });
        return null;
    };
    return (
        <Grid item xs={5} sx={{ mb: 5 }}>
            <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 5 }}>
                <Grid item xs={12} sx={{ mt: 4 }}>
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
                    <AccountTextField
                        required
                        id="firstname"
                        label="First Name"
                        value={firstNameValue}
                        variant="standard"
                        sx={{ mr: 3 }}
                        onFocus={editAccountInfo}
                        onChange={(e) => handleChange(e)}
                    />
                    <AccountTextField
                        required
                        id="lastname"
                        label="Last Name"
                        value={lastNameValue}
                        variant="standard"
                        sx={{ mr: 3 }}
                        onFocus={editAccountInfo}
                        onChange={(e) => handleChange(e)}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 4 }}>
                    <AccountTextField
                        required
                        id="email"
                        label="email"
                        value={emailValue}
                        variant="standard"
                        sx={{ mr: 3, width: 250 }}
                        onFocus={editAccountInfo}
                        onChange={(e) => handleChange(e)}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 4 }}>
                    <AccountTextField
                        id="phone"
                        label="Phone"
                        value={phoneValue}
                        variant="standard"
                        sx={{ mr: 3 }}
                        onFocus={editAccountInfo}
                        onChange={(e) => handleChange(e)}
                    />
                </Grid>
            </Grid>
            {!isEditing && (
                <Grid item xs={12}>
                    <Button onClick={editAccountInfo}>Edit</Button>
                </Grid>
            )}
            {isEditing && (
                <Grid container spacing={2}>
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

export default AccountInfo;
