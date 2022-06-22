import React, { useState } from 'react';

import { Grid, TextField, Typography, Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useSelector } from 'store';
import validator from 'email-validator';
import { validatePhone } from 'helpers/general';
import CreateNewInstructor from 'actions/studios/instructors/createNewInstructorAccount';

const CreateAccountTextField = styled(TextField)({
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

const CreateInstructor = () => {
    const theme = useTheme();
    const { dibsStudioId, studioid } = useSelector((state) => state.dibsstudio.config);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [timeoutArray, setTimeoutArray] = useState([]);
    React.useEffect(
        () => () => {
            timeoutArray.forEach((timeout) => {
                clearTimeout(timeout);
            });
        },
        [timeoutArray]
    );
    const clearData = () => {
        setPhone('');
        setEmail('');
        setFirstName('');
        setLastName('');
    };
    const handleErrorProcess = (errorMsg) => {
        setHasSuccess(false);
        setErrorMessage(errorMsg);
        setHasError(true);
        const timeoutiderror = setTimeout(() => {
            setHasError(false);
            setErrorMessage('');
        }, 10000);
        setTimeoutArray([...timeoutArray, timeoutiderror]);
    };
    const handleSuccessProcess = (successMsg) => {
        setHasError(false);
        setSuccessMessage(successMsg);
        setHasSuccess(true);
        const timeoutid = setTimeout(() => {
            setHasSuccess(false);
            setSuccessMessage('');
        }, 7000);
        clearData();
        setTimeoutArray([...timeoutArray, timeoutid]);
    };
    const handleTextChange = (e) => {
        if (e.target.id === 'phone') setPhone(e.target.value);
        if (e.target.id === 'email') setEmail(e.target.value);
        if (e.target.id === 'firstname') setFirstName(e.target.value);
        if (e.target.id === 'lastname') setLastName(e.target.value);
        if (hasError) setHasError(false);
        if (hasSuccess) setHasSuccess(false);
    };
    const handleSubmit = async () => {
        if (email.length > 3) {
            const isValidEmail = validator.validate(email);
            if (!isValidEmail) {
                handleErrorProcess(`The email address you entered doesn't seem to be valid. Can you try again?`);
                return;
            }
        }
        if (phone.length > 2) {
            const isValidPhone = validatePhone(phone);
            if (!isValidPhone) {
                handleErrorProcess(`The phone number you entered doesn't seem to be valid. Can you try again?`);
                return;
            }
        }
        await CreateNewInstructor(dibsStudioId, firstName, lastName, email, phone, studioid).then((res) => {
            if (res.msg === 'failure') {
                handleErrorProcess(res.error);
            }
            if (res.msg === 'success') {
                handleSuccessProcess(
                    'Successfully created a new employee account. You can create another account by submitting new information.'
                );
            }
        });
    };
    const guidancetext = `Fill in the information below to add new instructors. Note, this will allow instructors to be added to your schedule. This does not grant login privileges to instructors. `;
    return (
        <Grid container flex={1}>
            <Grid item xs={9}>
                <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, fontWeight: 400 }}>
                    {guidancetext}
                </Typography>
            </Grid>
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
            <Grid item xs={7} sx={{ mt: 3 }}>
                <CreateAccountTextField
                    required
                    id="firstname"
                    label="First Name"
                    value={firstName}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
                <CreateAccountTextField
                    required
                    id="lastname"
                    label="Last Name"
                    value={lastName}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
            </Grid>
            <Grid item xs={7} sx={{ mt: 4 }}>
                <CreateAccountTextField
                    id="email"
                    label="Email"
                    value={email}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
                <CreateAccountTextField
                    id="phone"
                    label="Phone Number"
                    value={phone}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
            </Grid>
            <Grid item xs={7} sx={{ mt: 4, mb: 5 }}>
                <Button onClick={handleSubmit}>Add New Instructor</Button>
            </Grid>
        </Grid>
    );
};
export default CreateInstructor;
